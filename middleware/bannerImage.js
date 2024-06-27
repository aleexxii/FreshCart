const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
    destination : function ( req , file , cb){
        cb(null , 'C:/Users/amale/OneDrive/Desktop/Grocyish/public/user/assets/images/bannerImages')
    },
    filename : ( req, file , cb)=>{
        cb(null , file.originalname)
    }
})

const bannerImg_upload = multer({ storage : storage })
module.exports = bannerImg_upload