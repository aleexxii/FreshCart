
const productDivs = document.querySelectorAll(".productDiv");
productDivs.forEach((div) => {
  div.querySelector("#incrementBtn").addEventListener("click", async () => {
    try {
      const quantity = Number(div.querySelector("#quantity").value) + 1;
      const price = Number(div.querySelector("#productPrice").textContent);
      document.getElementById('itemvalue').innerHTML = Number(document.getElementById('itemvalue').innerHTML) + price
      div.querySelector("#total").innerHTML = quantity * price;
      
      const productId = div.querySelector(".productId").value;
      const productTotalPrice = Number(div.querySelector("#total").textContent);

      const response = await fetch("/increment-cart-product", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId, productTotalPrice }),
      });
      if(!response.ok){
        throw new Error ('something went wrong while adding product quantity')
      }
      const data = await response.json()
      if(data.outOfStock){
        document.getElementById('checkoutBtn').disabled = true
        document.getElementById('outofStock').innerHTML = data.outOfStock

      }
    } catch (error) {
      console.log(error);
    }
  });

  div.querySelector("#decrementBtn").addEventListener("click", async () => {
    try {
      const total = Number(div.querySelector("#total").textContent);
      
      const price = Number(div.querySelector("#productPrice").textContent);
      document.getElementById('itemvalue').innerHTML = Number(document.getElementById('itemvalue').innerHTML) - price
      
      div.querySelector("#total").innerHTML = total - price;

      const quantity = Number(div.querySelector("#quantity").value) - 1;
      if (quantity < 0) {
        quantity = 0;
        total = 0;
      }

      const decrementBtn = div.querySelector("#decrementBtn");
    if (quantity === 0) {
      decrementBtn.disabled = true;
    }

      const productId = div.querySelector(".productId").value;
      const productTotalPrice = Number(div.querySelectorAll("#total").textContent);
      const response = await fetch("/decrement-cart-product", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId, productTotalPrice }),
      });
      
      if(!response.ok){
        throw new Error('somthing went wrong while decreasing product quantity')
      }
      const data = await response.json()

      if(data.outOfStock){
        document.getElementById('outofStock').classList.remove('text-danger')
        document.getElementById('outofStock').innerHTML = data.outOfStock
      }
    } catch (error) {
      console.log(error);
    }
  });

  div.querySelector("#productDeleteBtn").addEventListener("click", async () => {
    try {
      const productId = div.querySelector(".productId").value;

      const response = await fetch(`/remove-cart-product/${productId}`, {
        method: "get",
      });
      if (!response) {
        throw new Error("Somthing went wrong");
      }
      const data = await response.json();
      if (data.redirect) {
        window.location.href = data.redirect;
      }
    } catch (error) {
      console.log(error);
    }
  });

  div
    .querySelector(".showDeleteConfirmation")
    .addEventListener("click", async (event) => {
      event.preventDefault();

      const deletConfirmation = new bootstrap.Toast(
        div.querySelector("#removeToast")
      );
      deletConfirmation.show();
    });

  document.getElementById("checkoutBtn").addEventListener("click", async () => {
    console.log("clicked");
    try {
      const response = await fetch("/getCheckoutPage");

      if (!response.ok) {
        throw new Error("somthing went wrong");
      }
      if (response.ok) {
        window.location.href = "/getCheckoutPage";
      }
    } catch (error) {
      console.log(error);
    }
  });
});

document.getElementById("couponRedeemBtn").addEventListener("click", async () => {
    const couponCodeInput = document.getElementById("giftcard");
    const couponCodeField =couponCodeInput.options[couponCodeInput.selectedIndex];
    const couponCode = couponCodeField.value;
    const couponId = couponCodeField.getAttribute("data-id");
    console.log(couponCode,couponId);
    if(couponCode == 'Redeem your code'){
      return redeemCodeErr.innerHTML = 'Please select a redeem code'
    }
    const payload = {
      couponCode,
      couponId
    }
    try {
      const response = await fetch('/checking-coupon',{
        method : 'post',
        headers : {
          'Content-Type' : 'application/json'
        },
        body : JSON.stringify({ payload })
      })
      if(!response.ok){
        console.log(response);
        throw new Error('something went wrong while applying coupon')
      }
      const data = await response.json()
      console.log(data);
      if(data.message){
        document.getElementById('redeemCodeErr').innerHTML = data.message
      }
      if(data.redirect){
        window.location.href = data.redirect
      }
    } catch (error) {
      console.log(error);
    }
    
  });


  