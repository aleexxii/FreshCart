const { ObjectId } = require("mongodb");
const Orders = require("../../model/orderModel");
const Razorpay = require("razorpay");
const mongoose = require("mongoose");
const path = require('path')
const fs = require('fs')
const PDFDocument = require('pdfkit');

var instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY,
  key_secret: process.env.RAZORPAY_SECRET,
});

const userOrders = async (req, res) => {
  try {
    const userId = req.user.userId;
    let page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = 8
    const order = await Orders.find({ userId: userId }).limit(limit).skip((page - 1) * limit);
    const orderCount = await Orders.countDocuments({ userId: userId })

    const orders = order.sort((x,y)=>y.createdAt-x.createdAt)

    res.render("account-orders", {
      orders,
      orderCount,
      limit,
      currentPage : page,
      totalPages : Math.ceil(orderCount / limit),
      previous : page > 1 ? page - 1 : null,
      next : page < Math.ceil( orderCount / limit ) ? page + 1 : null 
    });
    
  } catch (err) {
    console.log(err);
  }
};

const postUserOrders = async (req, res) => {
  console.log(req.body);
  if (req.body.BtnValue == "Return") {
    const returnReason = req.body.returnReason;
    const productId = req.body.productId;
    console.log(returnReason, productId);
    try {
      const result = await Orders.updateOne(
        { products: { $elemMatch: { _id: productId } } },
        {
          $set: {
            "products.$.status": "Requested for Return",
            "products.$.returnReason": returnReason,
          },
        },
        { new: true }
      );
      if (result.matchedCount > 0) {
        return res.status(200).json({ success: true });
      }
    } catch (error) {
      console.log(error);
    }
  } else {
    const cancelReason = req.body.cnslRsn;
    const productId = req.body.productID;
    console.log(cancelReason, productId);
    try {
      const result = await Orders.updateOne(
        { products: { $elemMatch: { _id: productId } } },
        {
          $set: {
            "products.$.status": "Requested to Cancel",
            "products.$.cancelReason": cancelReason,
          },
        },
        { new: true }
      );
      if (result.matchedCount > 0) {
        return res.status(200).json({ success: true });
      }
    } catch (error) {
      console.log(error);
    }
  }
};

const postPaymentRetry = async (req, res) => {

  const { orderAddressId , orderTotal, orderId } = req.body;

  const order_id = orderId.replace(/^"|"$/g, "");

  const orderIds = new ObjectId(order_id);

  try {
    const orders = await Orders.find(orderIds);

    if (orders) {
      const amountInPaise = Math.round(parseFloat(orderTotal) * 100); // Convert to paise and ensure it's an integer
      
      var options = {
        amount: amountInPaise,
        currency: "INR",
        receipt: "freshcart@gmail.com",
      };

      instance.orders.create(options, (err, order) => {
        if (!err) {
          res.status(200).json({
            success: true,
            msg: "Order Created",
            order_id: order.id,
            amount: orderTotal,
            key_id: process.env.RAZORPAY_KEY,
            product_name: "product",
            description: "req.body.description",
            contact: "9887765465",
            name: "Fresh Cart",
            email: "freshcart@gmail.com",
          });

        } else {
          console.log("error --->", err);
          res
            .status(400)
            .send({ success: false, msg: "Something went wrong!" });
        }
      });
    }
  } catch (err) {
    console.log(err);
  }
};

const updateRetry = async (req,res)=>{
  const { paymentStatus, orderId } = req.query

  const order_id = new mongoose.Types.ObjectId(orderId)
  try {
    const order = await Orders.findByIdAndUpdate({ _id: order_id },
      {
        $set: {
          orderStatus: paymentStatus,
          'products.$[elem].status': paymentStatus,
        },
      },
      {
        arrayFilters: [{ 'elem.status': { $exists: true } }],
        new: true,
      })
    console.log(order);
  } catch (error) {
    console.log(error);
  }

}

const invoiceDownload = async ( req, res) => {
  const orderIdString = req.params.orderId;
  console.log(orderIdString, 'orderIdString');
  const orderId = new mongoose.Types.ObjectId(orderIdString);

  const userId = req.user.userId;

  
  try {
    const order = await Orders.aggregate([
        {$match : {userId : userId}},
        {$match : {_id : orderId}},
        {$unwind : '$products'},
        {
          $addFields : {
            addressId : { $toObjectId : '$address'}
          }
        },
        {$lookup : {
          from : 'addresses',
          localField : 'addressId',
          foreignField : '_id',
          as : 'shipping'
        }}
      ]);

    if (!order) {
      return res.status(404).send('Order not found');
    }

     // Create a document
     const doc = new PDFDocument({ margin: 50 });

     generateHeader(doc);
     generateCustomerInformation(doc, order);
     generateInvoiceTable(doc, order);
     generateFooter(doc);
 
     // Stream the PDF to the response
     res.setHeader('Content-Disposition', `attachment; filename=invoice-${orderIdString}.pdf`);
     res.setHeader('Content-Type', 'application/pdf');
     doc.pipe(res);
 
     doc.end();

    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
};

function generateHeader(doc) {
  
  const imagePath = path.resolve(__dirname, 'freshcart-logo.png');

  
  doc.image(imagePath, 50, 45, { width: 100 })
    .fillColor('#444444')
    .fontSize(20)
    .text('Freshcart Invoice', 215, 57)
    .fontSize(10)
    .text('123 Main Street', 200, 65, { align: 'right' })
    .text('Kochi, NY, 10025', 200, 80, { align: 'right' })
    .moveDown();
}

function generateFooter(doc) {
  doc.fontSize(10)
  .text('Payment is due within 15 days. Thank you for your business.', 50, 780, { align: 'center', width: 500 });
}

function generateCustomerInformation(doc, order) {

  const shipping = order[0].shipping[0] || {}; 

  doc.text(`Invoice Number: ${order[0]._id}`, 50, 200)
    .text(`Invoice Date: ${new Date(order[0].orderDate).toLocaleDateString()}`, 50, 215)
    .text(`Balance Due: ${(order[0].transaction_Amt)}`, 50, 230)
    .text(shipping.firstname, 500, 200)
    .text(shipping.address, 500, 215)
    .text(`${shipping.city || ''}, ${shipping.state || ''},${shipping.pincode || ''}`, 500, 230)
    .moveDown();
}

function generateTableRow(doc, y, c1, c3, c4, c5) {
  doc.fontSize(10)
      .text(c1, 50, y)
      .text(c3, 280, y, { width: 90, align: 'right' })
      .text(c4, 370, y, { width: 90, align: 'right' })
      .text(c5, 0, y, { align: 'right' });
}

function generateInvoiceTable(doc, orders) {
    invoiceTableTop = 330;
  doc.fontSize(12).text('Item', 50, invoiceTableTop)
    .text('Quantity', 280, invoiceTableTop, { width: 90, align: 'right' })
    .text('Price', 370, invoiceTableTop, { width: 90, align: 'right' })
    .text('Total', 0, invoiceTableTop, { align: 'right' });

  const tableHeaderY = invoiceTableTop + 20;
  doc.moveTo(50, tableHeaderY).lineTo(550, tableHeaderY).stroke();

  let position = tableHeaderY + 10;
  orders.forEach(order => {
    const product = order.products.product;
    const item = order.products;
    generateTableRow(doc, position, product.productName || '', item.price , item.quantity, item.totalPrice || item.price);
    position += 30;
  });

  const totalY = position + 20;
  doc.moveTo(50, totalY).lineTo(550, totalY).stroke();

  doc.fontSize(12).text('Total', 370, totalY + 20, { width: 90, align: 'right' })
    .text(orders[0].transaction_Amt, 0, totalY + 20, { align: 'right' });
}



module.exports = {
  userOrders,
  postUserOrders,
  postPaymentRetry,
  updateRetry,
  invoiceDownload
};


// require('../../../user/assets/images/logo/freshcart-logo.svg')


