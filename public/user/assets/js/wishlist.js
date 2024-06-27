const productDiv = document.querySelectorAll('.productDiv')
productDiv.forEach(productCard => {
productCard.querySelector('#wishlistIcon').addEventListener('click', async ()=>{
  const productId = productCard.querySelector('.productId').value
    const response = await fetch('/wishlist',{
        method : 'post',
        headers : {
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify({productId})
    }) 
    if(!response){
        throw new Error('somthing went wrong while adding wishlist')
    }
    const data = await response.json()
    if(data.message == 'product added'){
        const heartIcon = productCard.querySelector('#heartIcon')
        console.log(heartIcon);
        heartIcon.classList.remove('bi-heart',"bi")
        heartIcon.classList.add('bi','bi-heart-fill')
    }
    if(data.message == 'already exists'){
        const heartIcon = productCard.querySelector('#heartIcon')
        heartIcon.classList.remove('bi-heart-fill',"bi")
        heartIcon.classList.add('bi','bi-heart')
    }
  })
  })

const wishlistTr = document.querySelectorAll('.wishlistTr')
wishlistTr.forEach(product => {

    const productId = product.querySelector('#productId').value


    product.querySelector('#addToCartBtn').addEventListener('click',async ()=>{

        var toast = new bootstrap.Toast(document.getElementById("liveToast"));
        try {
            const response = await fetch(`/addToCart/${productId}`, {
              method: "post",
            });
            if (!response.ok) {
              throw new Error(`HTTP error ${response.status}`);
            }
      console.log(response);
            const data = await response.json();
            if (data.message) {
              toast.show();
            }
            console.log(data.message); // Log the response message
          } catch (error) {
            console.error("Error:", error);
          }
    })

    product.querySelector('#dltWishlistItem').addEventListener('click',async()=>{
        try {
            const response = await fetch('/delete-wishlist-item',{
                method : 'post',
                headers : {
                    'Content-Type' : 'application/json'
                },
                body : JSON.stringify({productId})
            })
            if(!response){
                throw new Error('somthing went wrong while deleting wishlist item')
            }
            const data = await response.json()
            if(data.redirect){
                window.location.href = data.redirect
            }
        } catch (error) {
            console.log(error);
        }
    })
    
})

async function searchInput(){
    console.log(document.getElementById('search-input').value);
    const search_text = document.getElementById('search-input').value
    
      if(!search_text){
        document.getElementById('search-suggestions').style.display = 'none'
        return
      }
    const response = await fetch ('/search-wishlistProducts',{
      method : 'post',
      headers : {
        'Content-Type' : 'application/json'
      },
      body : JSON.stringify({search_text})
    })
    if(!response.ok){
      return  new Error('something went wrong while product searching')
    }
    
    const data = await response.json()
    const suggestions = document.getElementById('search-suggestions')
    suggestions.innerHTML = ''
    
    if(data.searchedProducts && data.searchedProducts.length > 0){
        data.searchedProducts.forEach((item)=>{
            const product = item.products
          const div = document.createElement('div')
          div.classList.add('suggestions-item')
          div.innerHTML = 
          `<div class="product-container">
          <img src="../../user/assets/images/productImages/${product.image[0]}" style="height : 50px; width:50px;" alt="${product.productName}">
            <div>
              <div>${product.productName}</div>
              <small>${product.selectedCategory}</small>
            </div>
            </div>`
        div.addEventListener('click' , async() => showProduct(product))
          suggestions.appendChild(div)
        })
        suggestions.style.display = 'block'
      }
    
      function showProduct(product){
        window.location.href = `/product-list/${product._id}`;
      }
    }
    document.addEventListener('click' , function(event){
        const suggestions = document.getElementById('search-suggestions')
        const search_input = document.getElementById('search-input')
    
        if(!suggestions.contains(event.target) && !search_input.contains(event.target)){
          suggestions.style.display = 'none'
        }
      })
    
      document.getElementById('search-input').addEventListener('click', function(event) {
      const suggestions = document.getElementById('search-suggestions');
      if (suggestions.children.length > 0) {
        suggestions.style.display = 'block';
      }
    });
