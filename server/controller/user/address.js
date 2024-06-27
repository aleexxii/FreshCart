const User = require("../../model/userModel");
const customerAddress = require("../../model/addressModel");

const getAddress = async (req, res) => {
  const userId = req.user.userId;

  const address = await customerAddress.find({ userId });

  res.render("account-address", { address });
};

const postAddress = async (req, res) => {
  const {
    Firstname,
    Lastname,
    Phone,
    Address,
    State,
    District,
    City,
    Pincode,
    Landmark,
  } = req.body;

  const userId = req.user.userId;
  try {
    const newAddress = await customerAddress.create({
      userId,
      firstname: Firstname,
      lastname: Lastname,
      phone: Phone,
      address: Address,
      state: State,
      district: District,
      city: City,
      pincode: Pincode,
      landmark: Landmark,
    });
    return res.status(200).json({ message: "Address added" , redirect : '/account-address'});
  } catch (error) {
    console.log(error);
  }
};

const deleteAddress = async (req, res) => {

  const addressId = req.params.addressId;

  try {
    await customerAddress.findByIdAndDelete(addressId);
    return res.status(200).json({ message : 'Deleted' , redirect: "/account-address" });
  } catch (error) {
    console.log(error);
  }
};

const postEditAddress = async (req,res)=>{
    
    const addressId = req.params.addressId

    const { firstname, lastname, phone, address, state, district, city, pincode, landmark } = req.body
    try {
        await customerAddress.findByIdAndUpdate(addressId,{
            firstname : firstname,
            lastname : lastname,
            phone : phone,
            address : address,
            state : state,
            district : district,
            city : city,
            pincode : pincode,
            landmark : landmark
        },
        {new : true})

        return res.status(200).json({message : 'Updated' , redirect : '/account-address'})
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
  getAddress,
  postAddress,
  deleteAddress,
  postEditAddress
};
