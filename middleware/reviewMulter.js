const multer = require('multer')
const fs = require('fs')
require('path');

const uploadDir = 'C:/Users/amale/OneDrive/Desktop/Grocyish/public/user/assets/images/reviewImages'

if(!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir,{recursive : true})
}
// Multer storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir) // Destination folder for uploaded files
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname) // Use the original filename
    }
});

// Multer instance with configured storage
const upload = multer({ storage: storage });

module.exports = upload