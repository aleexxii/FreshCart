const { default: mongoose } = require('mongoose')
const Orders = require('../../model/orderModel')
const Wallet = require('../../model/walletModel')

const wallet = async (req,res)=>{
    try {
        const userId = req.user.userId
        const userObjId = new mongoose.Types.ObjectId(userId)
        const userWallet = await Wallet.findOne({user : userObjId})
        userWallet.transactions.sort((a,b)=>b.createdAt - a.createdAt)
        res.render('wallet', { userWallet })
    } catch (error) {
        console.log(error);
    }   
}



module.exports = {
    wallet
}