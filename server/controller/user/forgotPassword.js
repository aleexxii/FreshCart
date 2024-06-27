const { use } = require('passport');
const transporter = require('../../../middleware/setUpNodemailer')
require("dotenv");
const User = require('../../model/userModel')
const bcrypt = require('bcrypt')


const getForgotPassword = (req, res) => {
    try {
      res.render("forgotPassword");
    } catch (error) {
      console.log(error);
    }
  };

const postForgotPassword = async (req,res)=>{
  const email = req.body.email

  const user = await User.findOne({email:email})

  if(!user){
    return res.status(200).json({error : 'User not found'})
  }else {
    const timestamp = Date.now(); // Current timestamp
const url = `http://localhost:8080/reset-password/${user._id}/${timestamp}`
    // Send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Grocyish" amaleexxii@gmail.com', // Your name and email address
    to: email,
    subject: "OTP Verification",
    text: `Hi ${user.fname},\n\nPlease click on the following link to reset your password:\n${url}\n\nIf you did not request this, please ignore this email and your password will remain unchanged.\n`,
  });

  // console.log("Message sent: %s", info);
  }
  return res.status(200).json({redirect : '/reset-password'})
}

const resetPassword = (req,res)=>{
  const userId = req.params.Id
  const resetTimestamp = req.params.timestamp
  const currentTimestamp = Date.now()

  const timestampLimit = 60 * 60 * 1000;

  if(currentTimestamp - resetTimestamp > timestampLimit){
    return res.render('resetLinkExpires')
  }
  res.render('forgetPasswordReset' , {userId} )
}

const updatePassword = async (req,res)=>{

  const { newPassword,userId } = req.body

  try {
    const user = await User.findById(userId)


    if(!user){
      return res.status(404).json({error : 'User not found'})
    }

    const isSamePassword = await bcrypt.compare(newPassword,user.password)

    if(isSamePassword){
      return res.status(200).json({message : 'New password cannot be the same as the old password' })
    }
    const hashedPassword = await bcrypt.hash(newPassword,10)

    user.password = hashedPassword

  await user.save();

  return res.status(200).json({redirect : '/login'})
  
  } catch (error) {
    
  }

}


module.exports = {
  getForgotPassword,
  postForgotPassword,
  resetPassword,
  updatePassword
}