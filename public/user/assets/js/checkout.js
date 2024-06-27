let isValid = true;

function addnamevalidation() {
  const firstnameInput = document.getElementById("firstname").value;
  const firstname = firstnameInput.trim();

  if (firstname == "") {
    isValid = false;
    firstnameError.innerHTML = "Please enter Name";
    document.getElementById("firstname").focus();
  } else {
    firstnameError.innerHTML = "";
    isValid = true;
  }
  if (!/^[a-zA-Z]+$/.test(firstname)) {
    isValid = false;
    firstnameError.innerHTML = "First name can only contain letters";
    document.getElementById("firstname").focus();
  } else {
    firstnameError.innerHTML = "";
    isValid = true;
  }
}

function addlastnameValidation() {
  const lastnameInput = document.getElementById("lastname").value;
  const lastname = lastnameInput.trim();

  if (lastname === "") {
    isValid = false;
    lastnameError.innerHTML = "please enter the last name";
  } else {
    lastnameError.innerHTML = "";
    isValid = true;
  }
}

function addphoneNumberValidation() {
  const phoneNumnerINput = document.getElementById("phone").value;
  const phone = phoneNumnerINput.trim();

  if (phone == "") {
    isValid = false;
    phoneNumberError.innerHTML = "Please fill mobile number";
  }
  if (!/^[0-9]{10,10}$/.test(phone)) {
    isValid = false;
    phoneNumberError.innerHTML = "Please enter a valid number";
  } else {
    phoneNumberError.innerHTML = "";
    isValid = true;
  }
}

function addaddressValidation() {
  const addressInput = document.getElementById("address").value;
  const address = addressInput.trim();

  if (address == "") {
    isValid = false;
    addressError.innerHTML = "Please enter address";
  } else {
    addressError.innerHTML = "";
    isValid = true;
  }
}

function addcityValidation() {
  const cityInput = document.getElementById("city").value;
  const city = cityInput.trim();

  if (city == "") {
    isValid = false;
    cityError.innerHTML = "please enter city name";
  } else {
    cityError.inn = "";
    isValid = true;
  }
}

async function addpincodeValidation() {
  const pincodeInput = document.getElementById("pincode").value;
  const pincode = pincodeInput.trim();

  const pincodeRegEx = /^[0-9]{6,6}$/;
  if (!pincodeRegEx.test(pincode)) {
    isValid = false;
    return (pincodeError.innerHTML = "enter a valid pincode");
  }

  const pincodeVerifyResponse = await fetch(
    `https://api.postalpincode.in/pincode/${pincode}`
  );
  console.log(pincodeVerifyResponse);
  if (!pincodeVerifyResponse.ok) {
    isValid = false;
    document.getElementById("pincodeError").innerHTML = "invalid pincode";
  } else {
    const validPincode = await pincodeVerifyResponse.json();
    console.log(validPincode);
    if (validPincode[0].Status === "Error") {
      isValid = false;
      document.getElementById("pincodeError").innerHTML = "invalid pincode";
      return;
    } else {
      pincodeError.innerHTML = "";
      isValid = true;
    }
  }
}

function addlandmarkValidation() {
  const landmarkInput = document.getElementById("landmark").value;
  const landmark = landmarkInput.trim();
  if (landmark == "") {
    isValid = false;
    landmarkError.innerHTML = "Please fill landmark field";
  } else {
    landmarkError.innerHTML = "";
    isValid = true;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("saveBtn").addEventListener("click", async () => {
    if (!isValid) {
      returnError.innerHTML =
        "Somthing went wrong in your adding address.Please check all fields";
      return;
    }
    const data = {
      Firstname: document.getElementById("firstname").value,
      Lastname: document.getElementById("lastname").value,
      Phone: document.getElementById("phone").value,
      Address: document.getElementById("address").value,
      State: document.getElementById("state").value,
      District: document.getElementById("district").value,
      City: document.getElementById("city").value,
      Pincode: document.getElementById("pincode").value,
      Landmark: document.getElementById("landmark").value,
    };
    console.log(data);
    try {
      const response = await fetch("/account-address", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response) {
        throw new Error("Failed to update address");
      }
      const resdata = await response.json();
      if (resdata.message) {
        addressmsg.innerHTML = resdata.message;
        window.location.href = "/getCheckoutPage";
      }
    } catch (error) {
      console.log(error);
    }
  });
});

async function placeOrderCheckBtn() {
  let addressChecked = document.querySelector(
    'input[name="flexRadio"]:checked'
  );

  if (addressChecked == null) {
    const noAddress = (document.getElementById("fxcluid").innerHTML =
      "Please add a shipping address");
    document.getElementById("fxcluid").setAttribute("tabindex", "-1");
    document.getElementById("fxcluid").focus();
    return noAddress;
  }

  const addressId = addressChecked.value;

  let getSelectedValue = document.querySelector(
    "input[name='flexRadioDefault']:checked"
  );
  if (getSelectedValue == null) {
    return alert("please click a payment method");
  }
  console.log(getSelectedValue);
  const paymentMethod = getSelectedValue.value;

  const totalAmount = Number(document.getElementById("totalPrice").innerText);

  if (paymentMethod === "paypal") {

    const response = await fetch("/placeorder", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ totalAmount, paymentMethod }),
    });
    if (!response.ok) {
      throw new Error("somthing went wrong");
    }
    const data = await response.json();
    console.log("data", data);
    if (data.success) {
      console.log("data", data.success);
      var options = {
        key: "" + data.key_id + "",
        amount: "" + data.amount + "",
        currency: "INR",
        name:  "Fresh Cart" ,
        description: "" + "res.description" + "",
        image: "https://dummyimage.com/600x400/000/fff",
        order_id: "" + data.order_id + "",
        handler: function (response) {
          console.log(response);
          window.location.href = `/onlinePlaceorder?paymentStatus=Order Placed&addressId=${addressId}&totalAmt=${totalAmount}`
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
      razorpayObject.on("payment.failed", function (response) {
        console.log("response", response);
        window.location.href = `/onlinePlaceorder?paymentStatus=Failed&addressId=${addressId}&totalAmt=${totalAmount}`

      });
      razorpayObject.open();
    } else {
      console.log("errrr", data.msg);
      alert(data.msg);
    }
  }

  if (paymentMethod === "cashonDelivery") {
    const response = await fetch("/placeorder", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ totalAmount, paymentMethod, addressId }),
    });
    if (!response.ok) {
      throw new Error("somthing went to wrong");
    }
    const data = await response.json();
    if (data.redirect) {
      window.location.href = data.redirect;
    } else if (data.notSelectedPaymentMethod) {
      document.getElementById("notSelectedPaymentMethodError").innerHTML =
        data.notSelectedPaymentMethod;
    } else if (data.noAddress) {
      document.getElementById("noAddressError").innerHTML = data.noAddress;
      document.getElementById("noAddressError").setAttribute("tabindex", "-1");
      document.getElementById("noAddressError").focus();
    } else if (data.EmptyCart) {
      document.getElementById("emptyCart").innerHTML = data.EmptyCart;
      document.getElementById("emptyCart").setAttribute("tabindex", "-1");
      document.getElementById("emptyCart").focus();
    }
  }
}
