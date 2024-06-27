const Admin = require("../../model/adminLoginModel");
const Product = require("../../model/productmodel");
const Category = require("../../model/categoryModel");
const User = require("../../model/userModel");
const Orders = require('../../model/orderModel');
const Reviews = require('../../model/reviewModel')
const Customers = require('../../model/userModel')
const Wallet = require('../../model/walletModel')
const { default: mongoose } = require("mongoose");



const getAdminLogin = (req, res) => {
  try {
    res.render("adminLogin");
  } catch (error) {
    console.log(error);
  }
  
};

const home = async (req, res) => {
  try {

    const criteria = {
      $or : [
        {paymentMethod : 'cashonDelivery' , 'products.status' : 'Delivered'},
        {paymentMethod : 'Online' , 'products.status' : 'Delivered'}
      ]
    }
    const totalEarnings = await Orders.aggregate([
      {$match : criteria},
      {$unwind : '$products'},
      { $match: { 'products.status': 'Delivered' } },
      {$group : {_id : null , total : {$sum : '$products.totalPrice'}}}
    ])
    const total_orders = await Orders.countDocuments()

    const total_user = await Customers.countDocuments()

    const topSellingCategories = await Orders.aggregate([
      {$unwind : '$products'},
      {$match : {'products.status' : 'Delivered'}},
      {$group : {
        _id : '$products.product.selectedCategory',
        totalQuantity : {$sum : '$products.quantity'},
        totalPrice: {$sum : '$products.price'}
      }},
      {$sort : {totalQuantity : -1}},
      {$limit : 10},
      { $lookup: {
        from: 'categories',
        localField: '_id',
        foreignField: 'categoryName',
        as: 'categoryDetails'
      }},
      {$unwind:'$categoryDetails'}
    ])

const bestSellingProducts = await Orders.aggregate([
  {$unwind : '$products'},
  {$match : {'products.status' : 'Delivered'}},
  {$group : {
    _id : '$products.productId',
    totalQuantity : {$sum : '$products.quantity'},
    totalPrice : {$sum : '$products.price'}
  }},
  {$lookup : {
    from : 'products',
    localField : '_id',
    foreignField : '_id',
    as : 'productDetails'
  }},
  {$unwind : '$productDetails'},
  {$sort : {totalQuantity : -1}},
  {$limit : 10}
])
    res.render("adminHome" , {topSellingCategories,bestSellingProducts,totalEarnings,total_orders,total_user} );
  } catch (error) {
    console.log(error);
  }
};

const chart = async ( req , res ) => {
  console.log(req.body);
  
  try {
   
    if(Object.keys(req.body).length === 0){
      console.log('fetching data from database');
      const orders = await Orders.aggregate([
        {
          $group: {
            _id: {
              year: { $year: "$orderDate" }
            },
            totalSales: { $sum: "$transaction_Amt" }
          }
        },
        {
          $sort: { "_id.year": 1 }
        }
      ]);
  
      let labels = orders.map(order => `${order._id.year}`);
      let data = orders.map(order => order.totalSales);
      console.log('data : ', data);
  
      res.json({ labels, data });
      
    }else if(req.body.month == 'months' && req.body.year){
      const year = req.body.year
        console.log('inside the if :' , year);
      const yearOfOrder = await Orders.aggregate([
        { 
          $match: { 
            orderDate: {
              $gte: new Date(year, 0, 1),
              $lte: new Date(year, 11, 31, 23, 59, 59)
            }
          }
        },
        {
          $group: {
            _id: {
              month: { $month: "$orderDate" },
              year: { $year: "$orderDate" }
            },
            totalSales: { $sum: "$transaction_Amt" }
          }
        },
        {
          $sort: { "_id.year": 1, "_id.month": 1 }
        }
      ])
      labels = yearOfOrder.map(order => `${order._id.month}`);
      data = yearOfOrder.map(order => order.totalSales);
      console.log('Monthly data:', data);
      console.log(' labels:', labels);

      res.json({ labels, data });
      }else {
        const month = req.body.month;
        const year = req.body.year;
        console.log('Fetching data for month:', month, 'year:', year);
  
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59);
        console.log(startDate, endDate);
  
        const monthData = await Orders.aggregate([
          { $match: { orderDate: { $gte: startDate, $lte: endDate } } },
          {
            $group: {
              _id: {
                day: { $dayOfMonth: "$orderDate" },
                month: { $month: "$orderDate" },
                year: { $year: "$orderDate" }
              },
              totalSales: { $sum: "$transaction_Amt" }
            }
          },
          { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } }
        ]);
  
        labels = monthData.map(order => `${order._id.day}`);
        data = monthData.map(order => order.totalSales);
        console.log('Daily data for month:', data);
  
        res.json({ labels, data });
      }
    
  } catch (error) {
    console.log('error',error);
  }
}

const postAdminLogin = async (req, res) => {
  try {
    const findingAdmin = await Admin.findOne({ email: req.body.email });
    // console.log(findingAdmin);
    if (findingAdmin && findingAdmin.password == req.body.password) {
      res.redirect("./adminHome");
    } else {
      console.log("somthing missing");
    }
  } catch (error) {
    console.log(error);
  }
};

const getOrderList = async (req, res) => {
  try {
    const orderTotal = await Orders.aggregate([
      {
        $group : {
          _id : null,
          total : {$sum : '$transaction_Amt'},
          count : {$sum : 1}
        }
      }
    ])
    const total = orderTotal[0]?.total || 0
    const count = orderTotal[0]?.count || 0
    const orders = await Orders.aggregate([
      {
        $addFields: {
          userObjectId: {$toObjectId : '$userId'}   //user id getting an string so, we need to change string to objectId
        }
      },
          {
            $lookup : {
              from : 'users',
              localField : 'userObjectId',
              foreignField : '_id',
              as : 'user'
            }
          },
        {
          $addFields : {
          total : total,
          count : count
          }
        },
        {
          $sort :{createdAt : -1}
        }
    ])

    console.log('orders=>',orders);
        
  res.render("order-list" , { orders });
  } catch (error) {
    console.log(error);
  }
  
};

const getSingleOrder = async (req,res)=>{
  const orderId = new mongoose.Types.ObjectId(req.params.orderId)

  try {
    const orderDetails = await Orders.aggregate([
      {
        $match : {_id : orderId}
      },
      {
        $addFields: {
          userObjectId: {$toObjectId : '$userId'}   //user id getting an string so, we need to change string to objectId
        }
      },
          {
            $lookup : {
              from : 'users',
              localField : 'userObjectId',
              foreignField : '_id',
              as : 'user'
            }
          },
          {
            $unwind : '$user'
          },
          {
            $addFields : {addressId : {$toObjectId : '$address'}}
          },
          {
            $lookup : {
              from : 'addresses',
              localField : 'addressId',
              foreignField : '_id',
              as : 'userAddress'
            }
          },
          {
            $unwind : '$userAddress'
          }
    ])

    console.log(orderDetails);

    res.render('single-order', {orderDetails})
  } catch (error) {
    console.log(error);
  }
  
}

const postSingleOrder = async (req,res)=>{
  try {
    const { productStatus, productId, userId, paymentMethod, totalPrice } = req.body;
    
    const productObjid = new mongoose.Types.ObjectId(productId);

    // Update the status of the specific product in the order
    const updatedOrder = await Orders.updateOne(
        { 'products._id': productObjid },
        { $set: { 'products.$.status': productStatus } }
    );

    if (updatedOrder.nModified === 0) {
        return res.status(404).json({ error: 'Product not found in order' });
    }

    // Check if the status is "Requested to Cancel" and the payment method is "cashonDelivery"
    if (paymentMethod === 'cashonDelivery' && productStatus === 'Returned'|| paymentMethod === 'Online' && productStatus==='Cancelled' || paymentMethod === 'Online' && productStatus==='Returned' ) {
        const userObjid = new mongoose.Types.ObjectId(userId);
        let wallet = await Wallet.findOne({ user: userObjid });

        if (!wallet) {
            // Create a new wallet if it doesn't exist
            wallet = new Wallet({
                user: userObjid,
                walletBalance: 0,
                transactions: []
            });
        }

        // Add transaction for the product to the wallet
        wallet.transactions.push({
            amount: parseFloat(totalPrice),
            description: `Refund for ${productStatus} product ${productId}`,
            type: 'credit',
            transactionDate: new Date()
        });

        // Update the wallet balance
        wallet.walletBalance += parseFloat(totalPrice); // Assuming totalPrice is included in the request body

        await wallet.save();
    }

    console.log('Updated order:', updatedOrder);

    res.status(200).json({ message: 'Order updated successfully' });
} catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ error: 'Internal server error' });
}

}

// const filtter = async (req,res) => {

//   console.log('dfkjaskds ============ ',req.body);

//   const { endDate, startDate } = req.body
//   console.log(endDate);
//   console.log(startDate);
  
//   try {
//     const orderTotal = await Orders.aggregate([
//       { $match : {
//         createdAt : {
//           $gte : new Date(startDate),
//           $lte : new Date(endDate)
//         }
//       }
//     },
//       {
//         $group : {
//           _id : null,
//           total : {$sum : '$transaction_Amt'},
//           count : {$sum : 1}
//         }
//       }
//     ])

//     const total = orderTotal[0]?.total || 0
//     const count = orderTotal[0]?.count || 0
//     console.log('total ',total);

//     const filtteredOrder = await Orders.aggregate([
//       { $match : {
//         createdAt : {
//           $gte : new Date(startDate),
//           $lte : new Date(endDate)
//         }
//       }
//     },
//     {
//       $addFields : {
//         userid : {$toObjectId : '$userId'}
//       }
//     },
//     {
//       $lookup : {
//         from : 'users',
//         localField : 'userid',
//         foreignField : '_id',
//         as : 'userInfo'
//       }
//     },
//     {
//       $addFields : {
//         total : total,
//         count : count
//       }
//     } 
//   ])

  
  
//   console.log(filtteredOrder);
//     res.status(200).json({filtteredOrder})
//   } catch (error) {
//     console.log(error);
//   }

// }



const getReviews = async (req, res) => {
  try {
    const limit = 10;
    let page = req.query.page ? parseInt(req.query.page) : 1
    const reviewsCount = await Reviews.countDocuments({})

    const reviews = await Reviews.aggregate([
      {$lookup : {
        from : 'users',
        localField : 'userId',
        foreignField : '_id',
        as : 'user'
      }},
      {$lookup : {
        from : 'products',
        localField : 'productId',
        foreignField : '_id',
        as : 'product'
      }},
      {$unwind : '$product'},
      {$unwind : '$user'},
      {$project : {
        'createdAt' : 1,
        'rating' : 1,
        'headline' : 1,
        'user.fname' : 1,
        'product.productName' : 1
      }}
    ])
    console.log(reviews);
    res.render("reviews",
      {
        reviews,
        limit,
        reviewsCount,
        currentPage : page,
        totalPage : Math.ceil(reviewsCount / limit),
        previous : page > 1 ? page - 1 : null,
        next : Math.ceil(reviewsCount/limit) ? page + 1 : null
      }
    );
  } catch (error) {
    console.log(error);
  }
};






module.exports = {
  getAdminLogin,
  postAdminLogin,
  getOrderList,
  postSingleOrder,
  getSingleOrder,
  home,
  getReviews,
  chart
  // filtter
};
