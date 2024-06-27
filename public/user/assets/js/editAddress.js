let Valid = true;

function namevalidation() {
    
  const firstnameInput = document.getElementById("editFirstname").value;
  const firstname = firstnameInput.trim();

  if (firstname == "") {
    Valid = false;
    editfirstnameError.innerHTML = "Please enter Name";
  } else {
    editfirstnameError.innerHTML = "";
  }
  if (!/^[a-zA-Z]+$/.test(firstname)) {
    Valid = false;
    editfirstnameError.innerHTML = "First name can only contain letters";
  } else {
    editfirstnameError.innerHTML = "";
  }
}

function lastnameValidation() {
    
  const lastnameInput = document.getElementById("editLastname").value;
  const lastname = lastnameInput.trim();

  if (lastname === "") {
    Valid = false;
    editlastnameError.innerHTML = "please enter the last name";
  } else {
    editlastnameError.innerHTML = "";
  }
}

function phoneNumberValidation() {
    
  const phoneNumnerINput = document.getElementById("editPhone").value;
  const phone = phoneNumnerINput.trim();

  if (phone == "") {
    Valid = false
    editphoneNumberError.innerHTML = "Please fill mobile number";
  }
  if (!/^[0-9]{10,10}$/.test(phone)) {
    Valid = false
    editphoneNumberError.innerHTML = "Please enter a valid number";
  } else {
    editphoneNumberError.innerHTML = "";
  }
}

function addressValidation() {
    
  const addressInput = document.getElementById("editAddress").value;
  const address = addressInput.trim();

  if (address == "") {
    Valid = false
    editaddressError.innerHTML = "Please enter address";
  } else {
    editaddressError.innerHTML = "";
  }
}

function cityValidation() {
    
  const cityInput = document.getElementById("editCity").value;
  const city = cityInput.trim();

  if (city == "") {
    Valid = false
    editcityError.innerHTML = "please enter city name";
  } else {
    editcityError.inn = "";
  }
}

async function pincodeValidation() {
   
  const pincodeInput = document.getElementById("editPincode").value;
  const pincode = pincodeInput.trim();

  const pincodeRegEx = /^[0-9]{6,6}$/;
  if (!pincodeRegEx.test(pincode)) {
    Valid = false
    return (editpincodeError.innerHTML = "enter a valid pincode");
  }

  const pincodeVerifyResponse = await fetch(
    `https://api.postalpincode.in/pincode/${pincode}`
  );
  console.log(pincodeVerifyResponse);
  if (!pincodeVerifyResponse.ok) {
    Valid = false
    document.getElementById("editpincodeError").innerHTML = "invalid pincode";
  } else {
    const validPincode = await pincodeVerifyResponse.json();
    console.log(validPincode);
    if (validPincode[0].Status === "Error") {
        Valid = false
      document.getElementById("editpincodeError").innerHTML = "invalid pincode";
      return;
    } else {
        editpincodeError.innerHTML = "";
    }
  }
}

function landmarkValidation(){
    
    const landmarkInput = document.getElementById("editLandmark").value
    const landmark = landmarkInput.trim()
    if(landmark == ''){
        Valid = false
        editlandmarkError.innerHTML = 'Please fill landmark field'
    }else{
        editlandmarkError.innerHTML = ''
    }
}


const edit_address = document.getElementById("editAddressModal");
edit_address.addEventListener('show.bs.modal' , function(event){
    const button = event.relatedTarget


    const address = button.getAttribute("data-custom-data")
    const userAddress = JSON.parse(address)

    console.log(userAddress , ' user address');

    document.getElementById('editFirstname').value = userAddress.firstname
    document.getElementById('editLastname').value = userAddress.lastname
    document.getElementById('editPhone').value = userAddress.phone
    document.getElementById('editAddress').value = userAddress.address
    document.getElementById('editState').value = userAddress.state
    document.getElementById('editDistrict').value = userAddress.district
    document.getElementById('editCity').value = userAddress.city
    document.getElementById('editPincode').value = userAddress.pincode
    document.getElementById('editLandmark').value = userAddress.landmark

    document.getElementById('addressObjId').value = userAddress._id
})

document.getElementById('saveEditedBtn').addEventListener('click' , async(event)=>{
    event.preventDefault()
    if (!Valid) {
        editreturnError.innerHTML =
          "Somthing went wrong in your adding address.Please check all fields";
        return;
      }
    const data = {
        firstname : document.getElementById('editFirstname').value,
        lastname : document.getElementById('editLastname').value ,
        phone : document.getElementById('editPhone').value,
        address : document.getElementById('editAddress').value,
        state : document.getElementById('editState').value,
        district : document.getElementById('editDistrict').value,
        city : document.getElementById('editCity').value,
        pincode : document.getElementById('editPincode').value,
        landmark : document.getElementById('editLandmark').value
    }

    const addressId = document.getElementById('addressObjId').value
    
    const response = await fetch(`/edit-address/${addressId}`,{
        method : 'post',
        headers : {
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify(data)
    })
    if(!response){
        throw new Error('Somthing went wrong')
    }
    const ResponseData = await response.json()

    if(ResponseData.message){
        editSuccessMsg.innerHTML = ResponseData.message
    }
    if(ResponseData.redirect){
        window.location.href = ResponseData.redirect
    }
})