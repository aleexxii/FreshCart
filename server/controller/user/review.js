const review = require('../../model/reviewModel')

const postReview = async (req,res)=>{
    const userId = req.user.userId
    const { rating, headline, description, productId } = req.body
    const files = req.files
try {
    const imagePath = files.map(file => file.path)

    const newReview = new review ({
        userId : userId,
        productId : productId,
        rating : parseInt(rating),
        headline : headline,
        description : description,
        image : imagePath
    })
    await newReview.save()
    res.status(200).json({ message: 'Review submitted successfully' });
} catch (error) {
    console.log(error);
}
    
}

module.exports = {
    postReview
}