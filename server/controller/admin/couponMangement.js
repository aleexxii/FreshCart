const { default: mongoose } = require("mongoose");
const coupon = require("../../model/couponManagement");
const Orders = require('../../model/orderModel');
const exceljs = require('exceljs');


const getVendor = async (req, res) => {
    try {
      let limit = 8;
      let page = req.query.page ? parseInt(req.query.page) : 1;
      const ActivedCoupon = await coupon.find({isActive : 'Active'}).limit(limit).skip((page - 1) * limit).exec();

      const couponCount = await coupon.countDocuments({isActive : 'Active'})
  
      res.render("vendor",
      {
        ActivedCoupon,
        limit,
        couponCount,
        currentPage : page,
        previous : page > 1 ? page - 1 : null,
        next : page < Math.ceil(couponCount / limit) ? page+ 1 : null,
        totalPages : Math.ceil(couponCount / limit)
      });
    } catch (error) {
      console.log(error);
    }
  };

const postCoupon = async( req,res)=>{
    try {
        const {
            couponTitle,
            couponCondition,
            minPurchase,
            discount,
            totalCoupon
        } = req.body
        const image = req.file.filename
        let existingCoupon = await coupon.findOne({ code : couponTitle })
        
        if(existingCoupon){
          return res.status(200).json({message : 'The coupon is already exsiting'})
        }else{
           existingCoupon = new coupon({
            code : couponTitle,
            couponCondition,
            minPurchase,
            discount,
            totalCoupon,
            image
          })
        }
        
        existingCoupon.save()
        console.log('saved');
        res.status(200).json({redirect : './vendor'})
    } catch (error) {
        console.log(error);
    }
}

const deleteCoupon =  async (req,res)=>{
  try {
    const id = req.params.id
    const couponId = new mongoose.Types.ObjectId(id)
  console.log(couponId);
  await coupon.findByIdAndDelete(couponId)
  res.json({success:true})
  } catch (error) {
    console.log(error);
  }
}

const search = async (req,res)=>{
  const search_input = req.body.search_text
  
  try {
    const searched_coupons = await coupon.find({$or : [
      {code : {$regex : search_input , $options : 'i'}}
    ]})
    
    res.status(200).json({searched_coupons})
  } catch (error) {
    console.log(error);
  }
}







module.exports = {
    getVendor,
    postCoupon,
    deleteCoupon,
    search
}