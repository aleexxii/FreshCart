const Banner = require("../../model/bannerModel");
const Promotion = require('../../model/promotionModel')

const bannerPage = async ( req, res ) =>{
  try {    
    const limit = 8
    let page = req.query.page || 1
    const totalBanners = await Banner.countDocuments()
    const banners = await Banner.find({})
    
    res.render('banner-management',
      {
        banners,
        limit,
        currentPage : page,
        totalBanners,
        totalPages : Math.ceil(totalBanners/limit),
        previous : page > 1 ? page - 1 : null,
        next : page < Math.ceil(totalBanners / limit) ? page + 1 : null
      }
    )
  } catch (error) {
    console.log(error);
  }
}

const addBanner = async (req, res) => {
  try {

    res.render("addBanner");
  } catch (error) {
    console.log(error);
  }
};

const banner = async (req, res) => {
  try {
console.log(req.body);
    const {
      badgeText,
      badgeColor,
      discountPercentage,
      title,
      description,
      startingPrice,
      buttonText,
      buttonUrl,
    } = req.body;

    if(!req.file){
      return res.status(200).json({message : 'Image is not added'})
    }

    const file = req.file.filename

    let existingBanner = await Banner.findOne({ buttonUrl : buttonUrl })

    if(existingBanner){
        return res.status(200).json({message : 'Banner is already exists'})
      }
        const new_banner = await new Banner({
            backgroundImageUrl : file,
            badgeText : badgeText,
            badgeColor : badgeColor,
            discountPercentage : discountPercentage,
            title : title,
            description : description,
            startingPrice : startingPrice,
            buttonText : buttonText,
            buttonUrl : buttonUrl
        })
    
        new_banner.save()
    return res.status(200).json({redirect : './add-banner'})
  } catch (error) {
    console.log(error);
  }
};


const promotionPage = async (req,res)=>{
  try {
    const promotions = await Promotion.find({})
    res.render('promotion',{promotions})
  } catch (error) {
    console.log(error);
  }
}

const addPromotionPage = async(req,res)=>{
  try {
    res.render('addPromotion')
  } catch (error) {
    console.log(error);
  }
}

const uploadPromotion = async (req,res)=>{
  try {
    console.log(req.body);
    console.log(req.file);
    const {name, description, position , buttonUrl } = req.body
    const image = req.file.filename
    const newPromotion = await new Promotion({
      name : name,
      description : description,
      position : position,
      linkUrl : buttonUrl,
      imageUrl : image
    })
    newPromotion.save()
  } catch (error) {
    console.log(error);
  }
}

const deletePromotion = async (req,res)=>{
  try {
    const promotionId = req.params.id;
    await Promotion.findByIdAndDelete(promotionId);
    res.sendStatus(204); 
} catch (error) {
    console.error('Error deleting promotion:', error);
    res.status(500).json({ error: 'Internal server error' });
}
}
module.exports = {
  bannerPage,
  addBanner,
  banner,
  promotionPage,
  addPromotionPage,
  uploadPromotion,
  deletePromotion
};
