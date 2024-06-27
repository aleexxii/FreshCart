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
    isValid = true
  }
  if (!/^[a-zA-Z]+$/.test(firstname)) {
    isValid = false;
    firstnameError.innerHTML = "First name can only contain letters";
    document.getElementById("firstname").focus();
  } else {
    firstnameError.innerHTML = "";
    isValid = true
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
    isValid = true
  }
}

function addphoneNumberValidation() {
  const phoneNumnerINput = document.getElementById('phone').value;
  const phone = phoneNumnerINput.trim();

  if (phone == "") {

    isValid = false
    phoneNumberError.innerHTML = "Please fill mobile number";
  }
  if (!/^[0-9]{10,10}$/.test(phone)) {
    isValid = false
    phoneNumberError.innerHTML = "Please enter a valid number";
  } else {
    phoneNumberError.innerHTML = "";
    isValid = true
  }
}

function addaddressValidation() {
  const addressInput = document.getElementById("address").value;
  const address = addressInput.trim();

  if (address == "") {
    isValid = false
    addressError.innerHTML = "Please enter address";
  } else {
    addressError.innerHTML = "";
    isValid = true
  }
}

function addcityValidation() {
  const cityInput = document.getElementById("city").value;
  const city = cityInput.trim();

  if (city == "") {
    isValid = false
    cityError.innerHTML = "please enter city name";
  } else {
    cityError.inn = "";
    isValid = true
  }
}

async function addpincodeValidation() {
  const pincodeInput = document.getElementById("pincode").value;
  const pincode = pincodeInput.trim();

  const pincodeRegEx = /^[0-9]{6,6}$/;
  if (!pincodeRegEx.test(pincode)) {
    isValid = false
    return (pincodeError.innerHTML = "enter a valid pincode");
  }

  const pincodeVerifyResponse = await fetch(
    `https://api.postalpincode.in/pincode/${pincode}`
  );
  console.log(pincodeVerifyResponse);
  if (!pincodeVerifyResponse.ok) {
    isValid = false
    document.getElementById("pincodeError").innerHTML = "invalid pincode";
  } else {
    const validPincode = await pincodeVerifyResponse.json();
    console.log(validPincode);
    if (validPincode[0].Status === "Error") {
        isValid = false
      document.getElementById("pincodeError").innerHTML = "invalid pincode";
      return;
    } else {
      pincodeError.innerHTML = "";
      isValid = true
    }
  }
}



function addlandmarkValidation(){
    const landmarkInput = document.getElementById("landmark").value
    const landmark = landmarkInput.trim()
    if(landmark == ''){
        isValid = false
        landmarkError.innerHTML = 'Please fill landmark field'
    }else{
        landmarkError.innerHTML = ''
        isValid = true
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
        window.location.href = resdata.redirect;
      }
    } catch (error) {
      console.log(error);
    }
  });
});