document.addEventListener("DOMContentLoaded", async () => {
  document.getElementById("add-btn").addEventListener("click", async (event) => {
    event.preventDefault();

    try {
      const couponTitleInput = document.getElementById("couponTitle-field").value.trim();
      const couponConditionInput = document.getElementById("condition-field").value.trim();
      const minPurchaseInput = document.getElementById("limit-field").value.trim();
      const discountInput = document.getElementById("discount-field").value.trim();
      const totalCouponInput = document.getElementById("count-field").value.trim();
      const imageFile = document.getElementById('fileInput').files[0];

      
      if (couponTitleInput === "") {
        document.getElementById("couponTitle-field").focus();
        return (titleError.innerHTML = "Please enter a Title name");
      }

      if (couponConditionInput === "" || couponConditionInput <= 0) {
        document.getElementById("condition-field").focus();
        return (conditionError.innerHTML = "Please enter a valid condition");
      }

      if (minPurchaseInput === "" || minPurchaseInput <= 0) {
        document.getElementById("limit-field").focus();
        return (limitError.innerHTML = "Please enter a valid minimum purchase amount");
      }

      if (discountInput === "" || discountInput <= 0) {
        document.getElementById("discount-field").focus();
        return (discountError.innerHTML = "Please enter a valid discount value");
      }

      if (totalCouponInput === "" || totalCouponInput <= 0) {
        document.getElementById("count-field").focus();
        return (countError.innerHTML = "Please enter a valid total coupon amount");
      }

      if (!imageFile) {
        document.getElementById('imageError').textContent = 'Please add an image.';
        document.getElementById('fileInput').focus();
        return;
      }

      
      const formData = new FormData();
      formData.append("couponTitle", couponTitleInput);
      formData.append("couponCondition", couponConditionInput);
      formData.append("minPurchase", minPurchaseInput);
      formData.append("discount", discountInput);
      formData.append("totalCoupon", totalCouponInput);
      formData.append("imageFile", imageFile);

      const response = await fetch("./coupon", {
        method: "POST",
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to add coupon');
      }

      const data = await response.json();

      if (data.redirect) {
        window.location.href = data.redirect;
      }
      if (data.message) {
        couponAddingErr.innerHTML = data.message;
      }

    } catch (error) {
      console.error('Error adding coupon:', error.message);
    }
  });

  document.querySelectorAll('.coupon-delete').forEach(function(element){
    element.addEventListener('click', async function(event){
      event.preventDefault();
      const couponId = this.getAttribute('data-id');
      console.log(couponId);

      try {
        const response = await fetch(`./delete-coupon/${couponId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to delete coupon');
        }

        const data = await response.json();
        console.log(data);

        if (data.success) {
          this.closest('tr').remove();
        } else {
          alert('Failed to delete coupon');
        }
      } catch (error) {
        console.error('Error deleting coupon:', error.message);
        alert('Failed to delete coupon');
      }
    });
  });
});

async function search(){
  const search_text = document.getElementById('search-input').value
  const response = await fetch('./search-coupon',{
    method : 'post',
    headers : {
      'Content-Type' : 'application/json'
    },
    body: JSON.stringify({search_text})
  })
  if(!response.ok){
    throw new Error ('something went wrong while searching coupons')
  }
  const data = await response.json()
  console.log('data : ', data);

  const tbody = document.querySelector('#coupon-table tbody')
  tbody.innerHTML = ''
  data.searched_coupons.forEach(coupon =>{
    const row = document.createElement('tr')
    row.innerHTML = `     
                    <td>${ coupon.code }</td>
                    <td>${ coupon.discount }</td>
                    <td>${ coupon.minPurchase }</td>
                    <td>${ coupon.totalCoupon }</td>
                    <td><a class="coupon-delete" data-id="${ coupon._id }" ><i class="bi bi-trash"></a></i></td>`
        tbody.appendChild(row)
  })
}