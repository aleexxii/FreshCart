const express = require('express')
const route = express()
const path = require('path')
const passport = require('passport')
const { getGoogleURL , getUserFromGoogle } =require('../helper/OAuth')

const userController = require('../controller/user/auth')
const forgotPassword = require('../controller/user/forgotPassword')
const addToCart = require('../controller/user/cart')
const accountSettings = require('../controller/user/settings')
const accountAddress = require('../controller/user/address')
const orderController = require('../controller/user/orders')
const shopGrid = require('../controller/user/shopGrid')
const product = require('../controller/user/products')
const wishlist = require('../controller/user/wishlist')
const accountPaymentMethod = require('../controller/user/wallet')
const {verifyJWT,checkAuthenticated , isBlocked } = require('../../middleware/authentication')
const review = require('../controller/user/review')
const reviewMulter = require('../../middleware/reviewMulter')
const { validateObjectId } = require('../../middleware/errorHandler')

route.set('views','./views/user')
// route.use(express.static('public'))

route.get('/',userController.landingPage)
route.get('/login',userController.getLogin)
route.post('/login',userController.postLogin)
route.get('/signup',checkAuthenticated,userController.getSignup)
route.post('/signup',userController.postSignup)
route.get('/home',verifyJWT,isBlocked,userController.getHome)
route.post('/search',verifyJWT,isBlocked,userController.search)
route.post('/generate-otp',userController.getOtp)
route.get('/logout',verifyJWT,isBlocked,userController.userLogOut)

route.get('/products/:category',verifyJWT,isBlocked,product.filteredProducts)
route.get('/product-list/:productId',validateObjectId,verifyJWT,isBlocked,userController.getProductList)
route.post('/search-products',verifyJWT,isBlocked,product.search)

route.get('/forgot-password',forgotPassword.getForgotPassword)
route.post('/forgot-password',forgotPassword.postForgotPassword)
route.get('/reset-password/:Id/:timestamp',forgotPassword.resetPassword)
route.post('/reset-password',forgotPassword.updatePassword)

// ADD TO CART

route.get('/addToCart' ,verifyJWT,isBlocked,addToCart.getAddToCart)
route.post('/addToCart/:productId' ,verifyJWT,isBlocked,addToCart.postAddToCart)
route.post('/increment-cart-product',verifyJWT,isBlocked,addToCart.postIncrementProduct)
route.post('/decrement-cart-product',verifyJWT,isBlocked,addToCart.postDecrementProduct)
route.get('/remove-cart-product/:productId',verifyJWT,isBlocked,addToCart.deleteCartProduct)
route.get('/getCheckoutPage',verifyJWT,isBlocked,addToCart.getCheckoutPage)
route.post('/checking-coupon',verifyJWT,isBlocked,addToCart.checkingCoupon)


//SHOP GRID

route.get('/shop-grid/:clickedCategory',verifyJWT,isBlocked,shopGrid.getCategoryList)
route.post('/shop-grids',verifyJWT,isBlocked,shopGrid.filter)
route.post('/search-categoryProducts/:category',verifyJWT,isBlocked,shopGrid.search)

//PLACE ORDER

route.post('/placeorder',verifyJWT,isBlocked,addToCart.postPlaceOrder)
route.get('/onlinePlaceorder',verifyJWT,isBlocked,addToCart.onlinePaymentOrder)

// Google Auth Routes
route.get("/auth/google", getGoogleURL);
route.get("/google/callback", getUserFromGoogle);

// ACOUNT ORDERS

route.get('/account-orders',verifyJWT,isBlocked,orderController.userOrders)
route.post('/account-orders',verifyJWT,isBlocked,orderController.postUserOrders)
route.post('/payment-retry',verifyJWT,isBlocked,orderController.postPaymentRetry)
route.post('/updatepaymentretry',verifyJWT,isBlocked,orderController.updateRetry)
route.get('/orderView/:orderId',verifyJWT,isBlocked,addToCart.viewOrder)
route.post('/orderView/:orderId',verifyJWT,isBlocked,orderController.invoiceDownload)

// ACCOUNT SETTINGS

route.get('/account-settings',verifyJWT,isBlocked,accountSettings.getAccountSettings)
route.post('/account-settings',verifyJWT,isBlocked,accountSettings.postAccountSettings)
route.post('/account-forgetPassword',verifyJWT,isBlocked,accountSettings.postAccountForgetPassword)

// ACCOUNT ADDRESS

route.get('/account-address',verifyJWT,isBlocked,accountAddress.getAddress)
route.post('/account-address',verifyJWT,isBlocked,accountAddress.postAddress)
route.delete('/delete-address/:addressId',verifyJWT,isBlocked,accountAddress.deleteAddress)
route.post('/edit-address/:addressId',verifyJWT,isBlocked,accountAddress.postEditAddress)

//ACCOUNT PAYMENT METHOD

route.get('/account-payment-method',verifyJWT,isBlocked,accountPaymentMethod.wallet)

//WISHLIST
route.get('/wishlist',verifyJWT,isBlocked,wishlist.getwishlist)
route.post('/wishlist',verifyJWT,isBlocked,wishlist.postWishlist)
route.post('/delete-wishlist-item',verifyJWT,isBlocked,wishlist.deleteWishlistItem)
route.post('/add-to-cart',verifyJWT,isBlocked,wishlist.addToCart)
route.post('/search-wishlistProducts',verifyJWT,isBlocked,wishlist.search)

//REVIEW

route.post('/review',verifyJWT,isBlocked,reviewMulter.array('images',10),review.postReview)


// ERORR HANDLING
// route.use((req, res, next) => {
//     res.status(404).render('error-handler', { page: 'Page Not Found' });
//   });

module.exports = route


