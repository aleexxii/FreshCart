
function isStrong(){
    const password = document.getElementById('newPassword').value

    const passwordRegex = /^(?=.*[a-zA-])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/

    function validatePassword(password){
        return passwordRegex.test(password)
    }
    if(validatePassword(password)){
        isStrongError.innerHTML = 'Strong'
        isStrongError.classList.remove('text-danger')
        isStrongError.classList.add('text-success')
        return true
    }else{
        const passwordCriteria = "Password must be at least 8 characters long and contain at least one uppercase letter, one digit, and one symbol.";
        isStrongError.innerHTML = passwordCriteria
        isStrongError.classList.remove('text-success')
        isStrongError.classList.add('text-danger')
        return false
    }
}

function checkConfirmPassword(){
    const password = document.getElementById('newPassword').value
    const confirm_Password = document.getElementById('confirmPassword').value
    const doNotMatch = document.getElementById('doNotMatch')

    if(password !== confirm_Password){
        doNotMatch.innerHTML = "Password and Confirm Password does not match"
        doNotMatch.classList.remove('text-success')
        doNotMatch.classList.add('text-danger')
        return false;
    }else{
        doNotMatch.innerHTML = 'Strong'
        doNotMatch.classList.remove('text-danger')
        doNotMatch.classList.add('text-success')
        return true
    }
}
document.addEventListener('DOMContentLoaded' , function (){
  const form = document.getElementById("resetPasswordForm");
    const newPasswordInput = document.getElementById("newPassword");
    const confirmPasswordInput = document.getElementById("confirmPassword");

    newPasswordInput.addEventListener('input', function() {
        isStrong();
        checkConfirmPassword();
    });

    confirmPasswordInput.addEventListener('input', function() {
      checkConfirmPassword();
    });
  document.getElementById("resetPasswordForm").addEventListener("submit", async function (event) {
    event.preventDefault()
  
    console.log("clicked");
    const newPassword = document.getElementById("newPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const userId = document.getElementById('userId').value

    console.log(newPassword,confirmPassword ,' new password and confirm password');

    try {
      const response = await fetch("/reset-password", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newPassword, confirmPassword, userId }),
      });

      const data = await response.json()
      if(response.ok){
        if(data.message){
          samePass.innerHTML = data.message
        }
        if(data.redirect){
          window.location.href = data.redirect
        }
      }else{
        console.log('password reset failed');
      }
    } catch (error) {
      console.log(error , ' error resetting password');
    }
    
});
})

