const Product = require("../../model/productmodel");
const CartItem = require("../../model/cartModel");
const Address = require("../../model/addressModel");
const Order = require("../../model/orderModel");
const Coupon = require("../../model/couponManagement");
const Wishlist = require("../../model/wishlistModel");
const Razorpay = require("razorpay");
const { isNull } = require("lodash");
const { default: mongoose } = require("mongoose");

var instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY,
  key_secret: process.env.RAZORPAY_SECRET,
});

const postAddToCart = async (req, res) => {
  try {
    const productId = req.params.productId;
    const quantity = req.body.quantity ?? 1;
    const userId = req.user.userId;

    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    if (product.stockKeepingUnit === 0) {
      return res.status(200).json({ outOfStock });
    }
    let cartItem = await CartItem.findOne({ userId, productId });

    if (!cartItem) {
      cartItem = new CartItem({
        userId,
        productId,

        quantity,
        price: product.salePrice,
        totalPrice: product.salePrice * quantity,
      });
    } else {
      cartItem.quantity += Number(quantity);
      cartItem.totalPrice = cartItem.price * cartItem.quantity;
      await cartItem.save();
      return res
        .status(200)
        .json({ message: "Product quantity updated in cart" });
    }

    await cartItem.save();

    res.status(200).json({ message: "Product added to cart" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding product to cart" });
  }
};

const getAddToCart = async (req, res) => {
  const userId = req.user.userId;

  try {
    const cart = await CartItem.find({ userId }).populate("productId");

    let couponIds = cart[0]?.couponId;

    const coupon = await Coupon.findOne({ _id: couponIds, isActive: "Active" });

    const sumOfTotalProducts = await CartItem.aggregate([
      {
        $match: { userId: userId },
      },
      {
        $group: {
          _id: userId,
          sumOfTotalPrice: { $sum: "$totalPrice" },
        },
      },
    ]);

    //after coupon discounted total
    const couponDiscount = coupon?.discount || 0;
    console.log(couponDiscount);
    const afterProductDiscountedTotal =
      sumOfTotalProducts[0]?.sumOfTotalPrice - couponDiscount;

    // For checking coupon valid or not
    const total = sumOfTotalProducts[0]?.sumOfTotalPrice || 0;

    const activedCoupon = await Coupon.aggregate([
      {
        $match: { isActive: "Active" },
      },
      {
        $match: {
          $expr: {
            $lte: ["$minPurchase", total],
          },
        },
      },
    ]);

    res.render("addToCart", {
      cart,
      sumOfTotalProducts,
      activedCoupon,
      couponDiscount,
      afterProductDiscountedTotal,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "error fetching cart" });
  }
};

const postIncrementProduct = async (req, res) => {
  try {
    const { productId, productTotalPrice } = req.body;

    const product = await CartItem.findOne({ _id: productId });

    if (product) {
      product.quantity += 1;
      product.totalPrice = productTotalPrice;
      await product.save();
    }

    const products = await Product.findOne({ _id: product.productId });
    if (products.stockKeepingUnit - product.quantity <= 1) {
      return res.status(200).json({ outOfStock: "Product of of stock" });
    } else {
      return res.json({ message: "fasgsfgas" });
    }
  } catch (error) {
    console.log(error);
  }
};

const postDecrementProduct = async (req, res) => {
  let { productId } = req.body;

  try {
    const cartItem = await CartItem.findOne({ _id: productId });

    if (cartItem) {
      cartItem.quantity = cartItem.quantity - 1;

      cartItem.totalPrice = cartItem.totalPrice - cartItem.price;

      await cartItem.save();
    }
    const products = await Product.findOne({ _id: cartItem.productId });
    console.log(
      products.stockKeepingUnit - cartItem.quantity,
      "products.stockKeepingUnit - cartItem.quantity"
    );
    if (products.stockKeepingUnit - cartItem.quantity > 1) {
      return res.status(200).json({ outOfStock: "" });
    } else {
      return res.status(200).json({ mess: "asdf" });
    }
  } catch (err) {
    console.log(err);
  }
};

const deleteCartProduct = async (req, res) => {
  console.log("deleting");
  const productId = req.params.productId;
  console.log(productId);
  try {
    await CartItem.findByIdAndDelete(productId);
    return res.status(200).json({ redirect: "/addToCart" });
  } catch (error) {
    console.log(error);
  }
};

const getCheckoutPage = async (req, res) => {
  const userId = req.user.userId;
  try {
    const addresses = await Address.find({ userId: userId });
    const cart = await CartItem.aggregate([
      { $match: { userId: userId } },
      {
        $lookup: {
          from: "products", // Collection to join with
          localField: "productId", // Field from the CartItem collection
          foreignField: "_id", // Field from the Products collection
          as: "product", // Alias for the joined field
        },
      },
      {
        $unwind: "$product", // Unwind the product array
      },
    ]);

    let total = 0;
    for (let i = 0; i < cart.length; i++) {
      total = total + cart[i].totalPrice;
    }

    //For sending the coupon discount value to checkout page
    const couponId = cart[0]?.couponId || null;
    const coupon = await Coupon.findById(couponId);
    const couponDiscount = coupon?.discount || 0;

    total = total - couponDiscount;
    console.log(
      "cart total amount :",
      total,
      "couponDiscount :",
      couponDiscount
    );

    res.render("checkout", { addresses, cart, total, couponDiscount });
  } catch (error) {
    res
      .status(500)
      .json({ error: "something went wrong while getting checkout page" });
  }
};

const postPlaceOrder = async (req, res) => {
  try {
    const userId = req.user.userId;

    const paymentMethod = req.body.paymentMethod;
    const totalAmount = req.body.totalAmount;
    const addressId = req.body.addressId;

    if (paymentMethod == "paypal") {
      var options = {
        amount: totalAmount * 100, // amount in the smallest currency unit
        currency: "INR",
        receipt: "freshcart@gmail.com",
      };
      instance.orders.create(options, async (err, order) => {
        if (!err) {
          res.status(200).json({
            success: true,
            msg: "Order Created",
            order_id: order.id,
            amount: totalAmount * 100,
            key_id: process.env.RAZORPAY_KEY,
            product_name: "product",
            description: "req.body.description",
            contact: "1234567894",
            name: "Freshcart",
            email: "freshcart@gmail.com",
          });

          let couponDecrement = false;
          let couponID;
          

          
          for (const item of cart) {
            if (item.isCoupon && !couponDecrement) {
              couponID = item.couponId;
              const coupon = await Coupon.findById(couponID);
              if (coupon) {
                coupon.totalCoupon -= 1;
                if (coupon.totalCoupon <= 0) {
                  await Coupon.deleteOne({ _id: couponID });
                } else {
                  await coupon.save();
                }
                couponDecrement = true;
              }
            }
          }

        } else {
          res
            .status(400)
            .send({ success: false, msg: "Something went wrong!" });
        }
      });
    }

    if (paymentMethod == "on") {
      return res
        .status(200)
        .json({ notSelectedPaymentMethod: "Please select a payment method" });
    }
    const cart = await CartItem.aggregate([
      {
        $match: { userId: userId },
      },
      {
        $addFields: { status: "Order Placed" },
      },
      {
        $lookup: {
          from: "products",
          localField: "productId",
          foreignField: "_id",
          as: "product",
        },
      },
      {
        $unwind: "$product",
      },
    ]);

    if (cart.length === 0) {
      return res.status(200).json({ EmptyCart: "No products to purchase" });
    }
    const address = await Address.findOne({ userId });
    if (isNull(address)) {
      return res
        .status(200)
        .json({ noAddress: "Please add a Delivery address" });
    }

    if (paymentMethod == "cashonDelivery") {
      let order = await Order.find({ userId: userId });

      order = new Order({
        userId: userId,
        address: addressId,
        transaction_Amt: totalAmount,
        products: cart,
        paymentMethod
      });

      await order.save();

      let couponDecremented = false;
          let couponId;

          
          for (const item of cart) {
            if (item.isCoupon && !couponDecremented) {
              couponId = item.couponId;
              const coupon = await Coupon.findById(couponId);
              if (coupon) {
                coupon.totalCoupon -= 1;
                if (coupon.totalCoupon <= 0) {
                  await Coupon.deleteOne({ _id: couponId });
                } else {
                  await coupon.save();
                }
                couponDecremented = true;
              }
            }
          }

      await CartItem.deleteMany({ userId: userId });
      productQuantityDecrement(cart);
      res.status(200).json({ redirect: "/account-orders" });
    }
  } catch (error) {
    console.log(error);
  }
};

const onlinePaymentOrder = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { paymentStatus, totalAmt, addressId } = req.query;

    console.log(paymentStatus, totalAmt, addressId);
    console.log("paymentStatus : ", paymentStatus);

    if (paymentStatus == "Failed") {
      const cart = await CartItem.aggregate([
        {
          $match: { userId: userId },
        },
        {
          $addFields: { status: paymentStatus },
        },
        {
          $lookup: {
            from: "products",
            localField: "productId",
            foreignField: "_id",
            as: "product",
          },
        },
        {
          $unwind: "$product",
        },
      ]);

      let order = await Order.find({ userId: userId });

      order = new Order({
        userId: userId,
        address: addressId,
        transaction_Amt: Number(totalAmt),
        products: cart,
        paymentMethod: "Online",
        orderStatus: "Failed",
      });

      order.save();
      await CartItem.deleteMany({ userId: userId });
      res.redirect("/account-orders");
    } else {
      const cart = await CartItem.aggregate([
        {
          $match: { userId: userId },
        },
        {
          $addFields: { status: paymentStatus },
        },
        {
          $lookup: {
            from: "products",
            localField: "productId",
            foreignField: "_id",
            as: "product",
          },
        },
        {
          $unwind: "$product",
        },
      ]);

      let order = await Order.find({ userId: userId });

      order = new Order({
        userId: userId,
        address: addressId,
        transaction_Amt: Number(totalAmt),
        products: cart,
        paymentMethod: "Online",
      });

      order.save();
      await CartItem.deleteMany({ userId: userId });
      res.redirect("/account-orders");
    }
  } catch (error) {
    console.log(error);
  }
};

const viewOrder = async (req, res) => {
  try {
    const orderIdString = req.params.orderId;
    const orderId = new mongoose.Types.ObjectId(orderIdString);
    
    const userId = req.user.userId;
    const order = await Order.find({ userId: userId, _id: orderId });

    res.render("view-order", { order });
  } catch (error) {
    console.log(error);
  }
};

const checkingCoupon = async (req, res) => {
  const userId = req.user.userId;
  const { couponCode, couponId } = req.body.payload;
  try {
    const coupon = await Coupon.findOne({ _id: couponId });

    if (!coupon) {
      return res.status(200).json({ message: "Inactive or invalid coupon" });
    }
    const existingCoupon = await CartItem.findOne({
      userId: userId,
      isCoupon: true,
      couponId: couponId,
    });

    if (existingCoupon) {
      return res.status(200).json({ message: "Coupon already applied" });
    }
    const updatedCartItems = await CartItem.updateMany(
      { userId: userId },
      { $set: { isCoupon: true, couponId: couponId } },
      { new: true }
    );
    
    return res.status(200).json({ redirect: "/addToCart" });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "An error occured while applying the coupon" });
  }
};

module.exports = {
  getAddToCart,
  postAddToCart,
  postIncrementProduct,
  postDecrementProduct,
  deleteCartProduct,
  getCheckoutPage,
  postPlaceOrder,
  onlinePaymentOrder,
  viewOrder,
  checkingCoupon,
};

async function productQuantityDecrement(items) {
  for (const item of items) {
    const product = await Product.findOne({ _id: item.product._id });
    if (!product) {
      console.log("Products not found");
    }
    product.stockKeepingUnit =
      Number(product.stockKeepingUnit) - Number(item.quantity);
    product.save();
  }
}
