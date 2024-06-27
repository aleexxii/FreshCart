const { use } = require("passport");
const User = require("../../model/userModel");
const bcrypt = require("bcrypt");

const getAccountSettings = async (req, res) => {
  const userId = req.user.userId;
  const user = await User.findById(userId);
  res.render("account-settings", { user });
};

const postAccountSettings = async (req, res) => {
  const { firstname, lastname, email, phone } = req.body;

  console.log(req.body, "bodyy");

  const updateFields = {};
  if (firstname) updateFields.fname = firstname;
  if (lastname) updateFields.lname = lastname;
  if (email) updateFields.email = email;
  if (phone) updateFields.phone = phone;
  try {
    const userId = req.user.userId;
    const updatedUser = await User.findByIdAndUpdate(userId, updateFields, {
      new: true,
    });
    res.status(200).json({ message: "Account settings updated successfully" });
  } catch (error) {
    console.error("Error updating account settings:", error.message);
    res.status(500).json({ message: "Failed to update account settings" });
  }
};

const postAccountForgetPassword = async (req, res) => {
  try {
    const { newPassword, oldPassword } = req.body;
    
    const userId = req.user.userId;
    
    const user = await User.findById(userId);
    
    const isPasswordTrue = await bcrypt.compare(oldPassword, user.password);
    
    if (!isPasswordTrue) {
      res.status(200).json({ currentPassErr: "Your current password is not correct" });
    }else{
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      await user.save();
      return res.status(200).json({ successMessage: "Password updated successfully" });
    }
    
  } catch (error) {
    console.log(error);
  }
};



module.exports = {
  getAccountSettings,
  postAccountSettings,
  postAccountForgetPassword
};
