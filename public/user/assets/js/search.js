async function searchInput(){
    console.log(document.getElementById('search-input').value);
    const search_text = document.getElementById('search-input').value
    
      if(!search_text){
        document.getElementById('search-suggestions').style.display = 'none'
        return
      }
    const response = await fetch ('/search-products',{
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
        data.searchedProducts.forEach((product)=>{
          console.log('product : ' , product);
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
