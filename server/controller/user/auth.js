const User = require("../../model/userModel");
const Banner = require('../../model/bannerModel')
const Category = require("../../model/categoryModel");
const Products = require("../../model/productmodel");
const cartItems = require("../../model/cartModel");
const Wishlist = require("../../model/wishlistModel");
const Orders = require('../../model/orderModel')
const Reviews = require('../../model/reviewModel')
const Promotions = require('../../model/promotionModel')
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const OTP = require("../../model/userOtpModel");
require("dotenv");
const jwt = require("jsonwebtoken");
const Product = require("../../model/productmodel");
const { generateJWT } = require("../../helper/setJwtToken");
const { default: mongoose } = require("mongoose");

const landingPage = async (req, res) => {
  try {
    const categoryItems = await Category.find({ deletedAt: "listed" });
    const productItems = await Product.find({ deletedAt: "Not-Deleted" });
    res.render("landingPage", { categoryItems, productItems });
  } catch (error) {
    console.log(error);
  }
};
const getHome = async (req, res) => {
  try {
    const userId = req.user.userId;
    const limit = 10;
    const page = req.query.page ? parseInt( req.query.page ) : 1
    const categories = await Category.find({ deletedAt: "listed" });
    const product = await Products.find({ deletedAt: "Not-Deleted" }).limit(limit).skip( (page - 1) * limit);
    const productCount = await Products.countDocuments({ deletedAt: "Not-Deleted" })
    const cartCount = await cartItems.countDocuments({ userId: userId });
    const banners = await Banner.find({})
    const bottomRightPromo = await Promotions.findOne({ position : 'Top-Bottom'})
    const topRightPromo = await Promotions.findOne({ position : 'Top-Right'})

    const topSellingCategories = await Orders.aggregate([
      {$unwind : '$products'},
      {$match : {'products.status' : 'Delivered'}},
      {$group : {
        _id : '$products.product.selectedCategory',
        totalQuantity : {$sum : '$products.quantity'}
      }},
      {$sort : {totalQuantity : -1}},
      {$limit : 8},
      { $lookup: {
        from: 'categories',
        localField: '_id',
        foreignField: 'categoryName',
        as: 'categoryDetails'
      }},
      {$unwind:'$categoryDetails'}
    ])

    const products = product.map((product) => {
      return { ...product._doc };
    }).sort((a,z)=>z.createdAt-a.createdAt)

    let wishlistItem = await Wishlist.findOne({ userId: userId });
    if (wishlistItem) {
      wishlistItem = wishlistItem.products.map((productId) =>
        productId.product.toString()
      );
    }

    //BEST SELLING PRODUCTS
    const bestSellingProducts = await Orders.aggregate([
      {$unwind : '$products'},
      {$match : {'products.status' : 'Delivered'}},
      {$group : {
        _id : '$products.productId',
        totalQuantity : {$sum : '$products.quantity'},
      }},
      {$lookup : {
        from : 'products',
        localField : '_id',
        foreignField : '_id',
        as : 'productDetails'
      }},
      {$sort : {totalQuantity : -1}},
      {$limit : 10}
    ])

    return res.render("home", {
      limit,
      page,
      productCount,
      next : page < Math.ceil(productCount/limit) ? page + 1 : null,
      previous : page > 1 ? page - 1 : null,
      currentPage : page,
      totalPages : Math.ceil(productCount / limit),
      categories,
      products,
      cartCount,
      wishlistItem,
      bestSellingProducts,
      topSellingCategories,
      banners,
      topRightPromo,
      bottomRightPromo
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(404).send("Internal Server Error");
  }
};

const getLogin = (req, res) => {
  try {
    res.render("login");
  } catch (error) {
    console.log(error.message);
  }
};

const postLogin = async (req, res) => {
  let loginErrorMessage = "";
  try {
    const findingUser = await User.findOne({ email: req.body.email });
    // console.log("user from database =>", findingUser);

    if (!findingUser) {
      loginErrorMessage = "User not found";
      return res.render("login", { loginErrorMessage });
    }

    bcrypt.compare(
      req.body.password,
      findingUser.password,
      async (err, result) => {
        if (err) {
          // Handle error
          console.error(err);
          loginErrorMessage = "Internal server Error";
          return res.render("login", { loginErrorMessage });
        }
        if (result) {
          if (findingUser.status === "Unblocked") {
            await generateJWT(findingUser, res);
            res.redirect("/home");
          } else {
            loginErrorMessage = "Your account has been blocked";
            return res.render("login", { loginErrorMessage });
          }
        } else {
          loginErrorMessage = "Invalid password";
          // Render login page with error message
          return res.render("login", { loginErrorMessage });
        }
      }
    );
  } catch (error) {
    console.log(error);
    loginErrorMessage = "Internal Server Error";
    return res.render("login", { loginErrorMessage });
  }
};

const getSignup = (req, res) => {
  try {
    res.render("signup");
  } catch (error) {
    console.log(error.message);
  }
};

function generateOTP() {
  // Generate a random number between 1000 and 9999
  return Math.floor(1000 + Math.random() * 9000);
}

// Send OTP to user's email
async function sendOTP(email, otp) {
  // Create a nodemailer transporter
  let transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.GMAIL_USER, // Your Gmail email address
      pass: process.env.GMAIL_PASS, // Your Gmail password
    },
  });

  // Send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Grocyish" amaleexxii@gmail.com', // Your name and email address
    to: email,
    subject: "OTP Verification",
    text: `Your OTP for verification is: ${otp}`,
  });

  // console.log("Message sent: %s", info.messageId);
}

// Handle POST request to generate and send OTP
const getOtp = async (req, res) => {
  const { email } = req.query;

  try {
    // Generate OTP
    const generatedOTP = generateOTP();

    // Save OTP in database and send OTP to user's email
    await Promise.all([
      OTP.create({ email, otp: generatedOTP }),
      sendOTP(email, generatedOTP),
    ]);

    res.status(200).send("OTP sent successfully");
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error occurred while sending OTP");
  }
};

const postSignup = async (req, res) => {
  try {
    // Extract user details from request body
    const { firstname, lastname, email, password, otp } = req.body;

    // Check if the user with the same email already exists
    const existingUser = await User.findOne({ email: email });

    // If the user with the same email already exists, return an error
    if (existingUser !== null) {
      return res.status(200).json({ emailError: "Email already exists" });
    } else {
      const userOTP = await OTP.findOne({ email });
      // If the user's OTP is found in the database
      if (userOTP) {
        // Compare the user-provided OTP with the OTP from the database
        if (otp === userOTP.otp) {
          // console.log(otp, "userotp => ", userOTP.otp);

          // Hash the password
          const hashedPassword = await bcrypt.hash(password, 10);

          // Create a new user
          const newUser = new User({
            fname: firstname,
            lname: lastname,
            email: email,
            password: hashedPassword,
            otp: otp,
          });

          // Save the new user
          await newUser.save();

          // If the OTPs match, redirect to the login page
          res.status(200).json({ redirect: "/login" });
        } else {
          // If the OTPs don't match, show an error message
          res.status(200).json({ otpError: "Invalid otp" });
        }
      } else {
        // If the user's OTP is not found in the database, show an error message
        res.status(200).json({ otpError: "otp not found" });
      }
    }

    // Send a response indicating successful signup
    // res.status(200).json({ message: "User created successfully" });
  } catch (error) {
    // Log the error for debugging
    console.error("Error:", error);

    // Send a response indicating internal server error
    res.status(200).json({ message: "Internal server error" });
  }
};

const asyncFuncError = (func) => {
  return (req, res, next) => {
    func(req, res, next).catch(err => next(err));
  }
};

const getProductList = asyncFuncError(async (req, res) => {
  
  const userId = req.user.userId
  let productId = req.params.productId;

  const products = await Product.findById(productId);

  const category = products.selectedCategory
  const reletedProducts = await Product.find({selectedCategory : category , deletedAt : 'Not-Deleted' })
  
  if (!products) {
    return res.status(404)
  }

  productId = new mongoose.Types.ObjectId(productId)
  const reviews = await Reviews.aggregate([
    {$match : {productId : productId}},
    {$lookup : {
      from:'users',
      localField : 'userId',
      foreignField: '_id',
      as : 'user'
    }},
    {$unwind : '$user'}
  ])

const hasOrdered = await Orders.findOne({
userId: userId,
"products.productId": productId,
"products.status": "Delivered"
})

  res.render("single-product", { products, reviews, hasOrdered, reletedProducts });

}) 

const userLogOut = (req, res) => {
  try {
    res.clearCookie("userToken");

    // Redirect to login page or home page
    res.redirect("/login");
  } catch (err) {
    console.log(err);
  }
};

const search = async (req, res) => {
  try {
    const search = req.body.searchQuery;
    const searchedProducts = await Product.find(
      {
      deletedAt : "Not-Deleted",
      $or: [
        { productName: { $regex: search , $options : 'i' } },
        { selectedCategory: { $regex: search , $options : 'i' } },
      ],
    });
    console.log(searchedProducts);
    res.status(200).json({ searchedProducts });
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  landingPage,
  getLogin,
  postLogin,
  getSignup,
  postSignup,
  getOtp,
  getHome,
  getProductList,
  userLogOut,
  search,
};
