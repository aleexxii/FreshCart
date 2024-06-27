const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
    destination : function (req , file , cb){
        cb(null, 'C:/Users/amale/OneDrive/Desktop/Grocyish/public/user/assets/images/categoryImages')
    },
    filename : function(req, file, cb ){
        cb(null, file.originalname)
    }
})
console.log('kankfnadsfnjdsnfkjndskfjnkjs');
const upload = multer({storage : storage})

module.exports = upload