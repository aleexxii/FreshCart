const Product = require('../../model/productmodel');
const Wishlist = require('../../model/wishlistModel');
const User = require('../../model/userModel');
const Cart = require('../../model/cartModel')
const { ObjectId } = require('mongodb');
const { default: mongoose } = require('mongoose');


const getwishlist = async (req, res) => {
    try {
        const userId = req.user.userId
        const wishlist = await Wishlist.aggregate([
            {
                $match :{userId : userId}
            },
            {
                $unwind : '$products'
            },
            {
                $lookup : {
                    from: 'products',
                    localField : 'products.product',
                    foreignField : '_id',
                    as : 'wishlistItem'
                }
            },
            {
                $unwind : '$wishlistItem'
            },
            {
                $project : {
                    'wishlistItem.productName' : 1,
                    'wishlistItem.itemWeight' : 1,
                    'wishlistItem.status' : 1,
                    'wishlistItem.salePrice' : 1,
                    'wishlistItem.image' : 1,
                    'wishlistItem._id' : 1,
                }
            }
        ])

        res.render("wishlist",{wishlist});
    } catch (error) {
        console.log(error);
    }
    
  };

  const postWishlist = async (req,res)=>{
    const userId = req.user.userId
    const productId = req.body.productId
    console.log('userId',userId , '&' , 'productId',productId);
    try{
    let wishlist = await Wishlist.findOne({ userId : userId })
    console.log(wishlist);
    if(!wishlist){
        wishlist = new Wishlist ({
            userId : userId,
            products : [{ product : productId} ]  
        })
        wishlist.save()
        return res.status(200).json({message : 'product added'})
    }else { 
        const existingProduct =  wishlist.products.findIndex(prod=>prod.product.equals(productId))
console.log('findIndex',existingProduct);
// if you are trying to add a existingProduct it return the index of product otherwise return -1
        if(existingProduct !== -1){
            wishlist.products.pull({product : productId})
            wishlist.save()
            return res.status(200).json({message : 'already exists'})
        }else {
            wishlist.products.push({product : productId})
            wishlist.save()
            return res.status(200).json({message : 'product added'})
        }
    }
   
    }catch(err){
        console.log(err);
    }

}

const deleteWishlistItem = async (req,res)=>{
    const userId = req.user.userId
    const productId =new ObjectId(req.body.productId)
    console.log(productId,'----',userId);
    try {
        const wishlist = await Wishlist.findOneAndUpdate(
            {userId:userId},
            {$pull : {products : { product : productId }}}
        )
        wishlist.save()
        res.status(200).json({redirect : '/wishlist'})
    } catch (error) {
        console.log(error);
    }
}

const addToCart = async (req,res)=>{
    let { productId } = req.body
    const userId = req.user.userId
    try {

        if (!req.user) {
            return res.status(401).json({ message: "User not authenticated" });
          }

          const product = await Product.findById(productId);

          if (!product) {
            return res.status(404).json({ message: "Product not found" });
          }

          if(product.stockKeepingUnit === 0){
            return res.status(200).json({outOfStock})
          }
          let cart = await Cart.findOne({ userId, productId })
          console.log('cart :',cart);
          if (!cart) {
            cart = new Cart({
              userId,
              productId,
              quantity : 1,
              price: product.salePrice,
              totalPrice: product.salePrice * 1,
            });
          } else {
            cart.quantity += 1;
            cart.totalPrice = cart.price * cart.quantity;
            await cart.save();
          }
          await cart.save();
        productId = new mongoose.Types.ObjectId(productId)
        await Wishlist.updateOne(
            { userId: userId },
            { $pull: { products: { product: productId } } }
        );
        res.status(200).json({ message: 'Product added to cart and removed from wishlist' });
    } catch (error) {
        console.log(error);
    }
}

const search = async (req,res)=>{
    const userId = req.user.userId
    const search_input = req.body.search_text
    try {
        const searchedProducts = await Wishlist.aggregate([
            {$match : {userId : userId}},
            {
                $lookup : {
                    from : 'products',
                    localField : 'products.product',
                    foreignField : '_id',
                    as : 'products'
                }
            },
            {$unwind : '$products'},
            { 
                $match: {'products.productName': { $regex: search_input, $options: 'i' } } 
            }
        ])
        console.log(searchedProducts);
        res.status(200).json({searchedProducts})
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    getwishlist,
    postWishlist,
    deleteWishlistItem,
    addToCart,
    search
}