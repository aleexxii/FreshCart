
function namevalidation() {
    const Firstname = document.getElementById('firstname').value
    const firstname = Firstname.trim()
    console.log(Firstname ,'and' ,firstname);

    if(firstname == ""){
        document.getElementById('saveAdrress').disabled = true
        fnameError.innerHTML = 'please enter First Name'
        document.getElementById('firstname').focus()
    }
}
function emailValidation() {
    const emailInput = document.getElementById("editEmail");
    const email = emailInput.value.trim();
  
    const emailPattern =
      /^[^\s@]+@(gmail|yahoo|hotmail|outlook|aol|icloud|protonmail|mail|yandex|zoho)\.(com|in|org|net|edu|gov|mil|biz|info|name|coop|aero|eu|int|pro|museum|arpa|[a-z]{2})$/;
  
    if (!emailPattern.test(email)) {
        document.getElementById('saveAdrress').disabled = true
      emailErrorMsg.innerHTML = "please Enter a valid Email address";
    } else {
      emailErrorMsg.innerHTML = "";
    }
  }

document.addEventListener('DOMContentLoaded', function (){
    document.getElementById('saveAdrress').addEventListener('click' , async (event)=>{
        event.preventDefault();
    
        const firstname = document.getElementById('firstname').value
        const lastname = document.getElementById('lastname').value
        const email= document.getElementById('editEmail').value
    
        try {
            const response = await fetch('/account-settings',{
                method : 'post',
                headers : {
                    'Content-Type' : 'application/json'
                },
                body : JSON.stringify({firstname,lastname,email})
            })
            if(!response){
                throw new Error('Failed to update account settings')
            }
    
            const data = await response.json()
            console.log('return response',data);
            const feedbackMessageElement = document.getElementById('feedbackMessage');
                    feedbackMessageElement.textContent = data.message;
                    feedbackMessageElement.style.color = 'green';
        } catch (error) {
            console.log(error);
        }
    })
})

function passwordValidation(){
    const newPassword = document.getElementById('newPassword').value

const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[a-zA-Z\d!@#$%^&*()_+]{8,}$/;

function validatePassword(){
    return passwordRegex.test(newPassword)
}
if (validatePassword(password)) {
    passwordMessage.innerHTML = "Strong";
    passwordMessage.classList.remove("text-danger");
    passwordMessage.classList.add("text-success");
  } else {
    document.getElementById("forgetPassword").disabled = true
    const signUpErrorMessage =
      "Password must be at least 8 characters long and contain at least one uppercase letter, one digit, and one symbol.";
    passwordMessage.innerHTML = signUpErrorMessage;
    passwordMessage.classList.remove("text-success");
    passwordMessage.classList.add("text-danger");
  }
}

document.getElementById("forgetPassword").addEventListener('click' , async function(event){
    event.preventDefault()

    
    const newPassword = document.getElementById('newPassword').value
    const oldPassword = document.getElementById('currentPassword').value


    try {
        const response = await fetch('/account-forgetPassword',{
            method : 'post',
            headers : {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify({newPassword,oldPassword})
        })
            if(!response){
                throw new Error('Failed to update account settings')
            }
        const data = await response.json()
        if(data.currentPassErr){
            currentPasswordError.innerHTML = data.currentPassErr;
        }
        if(data.successMessage){
            successMessage.innerHTML=data.successMessage
        }
    } catch (error) {
        
    }

})