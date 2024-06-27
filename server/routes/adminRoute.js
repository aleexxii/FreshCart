const express = require('express');
const route = express();


const adminController = require('../controller/admin/auth');
const adminCategory = require('../controller/admin/Category')
const adminProduct = require('../controller/admin/Product')
const couponManagement = require('../controller/admin/couponMangement')
const adminCustomerdetails = require('../controller/admin/Customer')
const productImageMulter = require('../../middleware/productImageMulter')
const categoryImageMulter = require('../../middleware/categoryImages')
const BannerController = require('../controller/admin/banner')
const bannerImg_Multer = require('../../middleware/bannerImage')
const promotionImg_Multer = require('../../middleware/promotionMulter')
const couponImg_Multer = require('../../middleware/couponMulter')

// Set views directory
route.set('views', './views/admin');


route.get('/login',adminController.getAdminLogin)
route.post('/login',adminController.postAdminLogin)
route.get('/adminHome',adminController.home)
route.post('/adminHome',adminController.chart)

//CATEGORIES

route.get('/categories',adminCategory.getCategories)
route.get('/add-category',adminCategory.getAddCategories)
route.post('/add-category',categoryImageMulter.single('file'),adminCategory.postAddCategory)
route.get('/edit-category', adminCategory.editCategoryPage);
route.post('/edit-category',categoryImageMulter.single('file'),adminCategory.editedCategory)
route.get('/category-deleted',adminCategory.categoryDeleting)
route.get('/deleted-category',adminCategory.deletedCategory)


//CUSTOMERS

route.get('/customers',adminCustomerdetails.getCustomers)
route.post('/block-user',adminCustomerdetails.userBlock)
route.post('/unblock-user',adminCustomerdetails.userUnblock)

route.get('/order-list',adminController.getOrderList)
route.get('/single-order/:orderId',adminController.getSingleOrder)
route.post('/single-order/:orderId',adminController.postSingleOrder)
// route.post('/fileter-date',adminController.filtter)

//PRODUCTS

route.get('/products',adminProduct.getProducts)
route.get('/add-product',adminProduct.getAddProduct)
route.post('/addNewProduct',productImageMulter.array('files',5),adminProduct.postCreateProduct)
route.get('/edit-product',adminProduct.editProduct)
route.post('/update-product',productImageMulter.any(),adminProduct.updatedproductPage)
route.get('/deleted-product',adminProduct.deletedproductPage)
route.get('/product-deleted',adminProduct.deletingProduct)


route.get('/vendor',couponManagement.getVendor)
route.post('/coupon',couponImg_Multer.single('imageFile'),couponManagement.postCoupon)
route.delete('/delete-coupon/:id',couponManagement.deleteCoupon)
route.post('/search-coupon',couponManagement.search)

route.get('/reviews',adminController.getReviews)


// BANNER
route.get('/banners',BannerController.bannerPage)
route.get('/add-banner',BannerController.addBanner)
route.post('/submit-banner',bannerImg_Multer.single('file'),BannerController.banner)

route.get('/promotion',BannerController.promotionPage)
route.get('/add-promotion',BannerController.addPromotionPage)
route.post('/position-form',promotionImg_Multer.single('file'),BannerController.uploadPromotion)
route.delete('/delete-promotion/:id',BannerController.deletePromotion)


module.exports = route