document.addEventListener("click", async () => {
  console.log("clicekd");
  const orderId = document.getElementById('failedRetryBtn').getAttribute("data-custom-data");
  const orderAddressId = document.getElementById("orderAddressId").value;
  const orderTotal = document.getElementById("orderTotal").value;
  console.log(orderTotal, orderAddressId,orderId);
  try {
    const response = await fetch('/payment-retry', {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ orderTotal, orderAddressId, orderId }),
    });
    if (!response.ok) {
      throw new Error("something went wrong while retry to payment");
    }
    const data = await response.json();
    if (data.success) {
      console.log("data", data.success);
      var options = {
        key: "" + data.key_id + "",
        amount: "" + data.amount + "",
        currency: "INR",
        name: "Fresh Cart",
        description: "" + "res.description" + "",
        image: "https://dummyimage.com/600x400/000/fff",
        order_id: "" + data.order_id + "",
        handler: async function (response) {
          console.log(response);
          const res = await fetch(`/updatepaymentretry?paymentStatus=Order Placed&orderId=${orderId}`,{
            method : 'post',
          })
        },
        prefill: {
          contact: "" + "res.contact" + "",
          name: "" + "res.name" + "",
          email: "" + "res.email" + "",
        },
        notes: {
          description: "" + "res.description" + "",
        },
        theme: {
          color: "#00cc66",
        },
      };
      var razorpayObject = new Razorpay(options);
      console.log(razorpayObject, "razorpayObject");
      razorpayObject.on("payment.failed", async function (response) {
        console.log("response", response);
        const res = await fetch(`/updatepaymentretry?paymentStatus=Failed&orderId=${orderId}`,{
          method : 'post',
        })
      });
      razorpayObject.open();
    } else {
      console.log("errrr", data.msg);
      alert(data.msg);
    }
  } catch (err) {
    console.log(err);
  }
});
