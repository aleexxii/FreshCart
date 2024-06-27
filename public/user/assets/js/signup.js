function nameValidation() {
  const firstNameInput = document.getElementById("formSignupfname");
  const firstname = firstNameInput.value.trim();

  if (firstname == "") {
    firstNameError.innerHTML = "Please enter First Name.";
  }

  if (!/^[a-zA-Z]+$/.test(firstname)) {
    firstNameError.innerHTML = "First name can only contain letters.";
  } else {
    firstNameError.innerHTML = "";
  }
}

function emailValidation() {
  const emailInput = document.getElementById("formSignupEmail");
  const email = emailInput.value.trim();

  const emailPattern =
    /^[^\s@]+@(gmail|yahoo|hotmail|outlook|aol|icloud|protonmail|mail|yandex|zoho)\.(com|in|org|net|edu|gov|mil|biz|info|name|coop|aero|eu|int|pro|museum|arpa|[a-z]{2})$/;

  if (!emailPattern.test(email)) {
    errorMessage.innerHTML = "please Enter a valid Email address";
    document.getElementById("getOTP").disabled = true;
  } else {
    errorMessage.innerHTML = "";
    document.getElementById("getOTP").disabled = false;
  }
}

document.getElementById("getOTP").addEventListener("click", async function () {
  const emailInput = document.getElementById("formSignupEmail");
  const email = emailInput.value.trim();
  // Disable the button immediately upon click
  document.getElementById("getOTP").disabled = true;
  
  try {
    // Attempt to generate OTP
    const emailOtpResponse = await fetch(`/generate-otp?email=${email}`, {
      method: "post",
    });

    if (emailOtpResponse.ok) {
      // Request successful, reset the timer
      resetTimer();
    } else {
      // Request failed, handle the error
      errorMessage.innerHTML = "Failed to generate OTP. Please try again.";
      document.getElementById("getOTP").disabled = false;
    }
  } catch (error) {
    console.log(error);
    errorMessage.innerHTML =
      "An unexpected error occurred. Please try again later.";
    document.getElementById("getOTP").disabled = false;
  }
});

// Function to reset the timer
function resetTimer() {
  let secondsLeft = 60;
  const timerInterval = setInterval(() => {
    secondsLeft--;
    if (secondsLeft <= 0) {
      // Enable the button and reset text
      document.getElementById("getOTP").disabled = false;
      document.getElementById("getOTP").innerText = "Resend OTP";
      clearInterval(timerInterval);
    } else {
      // Update button text to show remaining time
      document.getElementById("getOTP").innerText = `Resend OTP (${secondsLeft}s)`;
      document.getElementById("getOTP").disabled = true;
    }
  }, 1000);
}


function isStrong() {
  const password = document.getElementById("formSignupPassword").value;

  const passwordRegex =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/;

  function validatePassword(password) {
    return passwordRegex.test(password);
  }
  if (validatePassword(password)) {
    passwordMessage.innerHTML = "Strong";
    passwordMessage.classList.remove("text-danger");
    passwordMessage.classList.add("text-success");
  } else {
    const signUpErrorMessage =
      "Password must be at least 8 characters long and contain at least one uppercase letter, one digit, and one symbol.";
    passwordMessage.innerHTML = signUpErrorMessage;
    passwordMessage.classList.remove("text-success");
    passwordMessage.classList.add("text-danger");
  }
}

function confirmPasswordChecking() {
  const password = document.getElementById("formSignupPassword").value;
  const confirmPassword = document.getElementById("formConfirmPassword").value;

  if (password !== confirmPassword) {
    confirmPasswordFalse.innerHTML ="Password and Confirm Password does not match";
    confirmPasswordFalse.classList.remove("text-success");
    confirmPasswordFalse.classList.add("text-danger");
  } else {
    confirmPasswordFalse.innerHTML = "Matches";
    confirmPasswordFalse.classList.remove("text-danger");
    confirmPasswordFalse.classList.add("text-success");
  }
}

document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("signupForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();

      const firstname = document.getElementById("formSignupfname").value;
      const lastname = document.getElementById("formSignuplname").value;
      const email = document.getElementById("formSignupEmail").value;
      const password = document.getElementById("formSignupPassword").value;
      const otp = document.getElementById("formOTP").value;

      const formData = {
        firstname,
        lastname,
        email,
        password,
        otp,
      };

      console.log(formData);

      // Send Fetch request to server
      fetch("/signup", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: { "Content-Type": "application/json" },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          // Handle success response
          console.log('thisi is==>',data);
          if (data.emailError) {
            document.getElementById("error-message").innerHTML = data.emailError;
          }else if(data.otpError){
            document.getElementById('otpError').innerHTML = data.otpError;
          }else{
            window.location.href = "/login";
          }
        })
        .catch((error) => {
          // Handle error response
          console.error("Error:", error);
        });
    });
});