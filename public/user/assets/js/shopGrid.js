document.querySelectorAll(".categoryProduct").forEach((category) => {
  category.addEventListener("click", async () => {
    try {
      const clickedCategory =
        document.querySelector(".clickedCategory").textContent;
      const response = await fetch(`/shop-grid/${clickedCategory}`, {
        method: "GET",
      });

      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  });
});

//finding category
const url = window.location.href;
const urlParams = new URL(url);
const pathname = urlParams.pathname;
const category = decodeURIComponent(pathname.split("/").pop());

async function searchInput() {
  const search_text = document.getElementById("search-input").value;
  console.log("category :", category);
  if (!search_text) {
    document.getElementById("search-suggestions").style.display = "none";
    return;
  }
  const response = await fetch(`/search-categoryProducts/${category}`, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ search_text }),
  });
  if (!response.ok) {
    return new Error("something went wrong while product searching");
  }

  const data = await response.json();

  const suggestions = document.getElementById("search-suggestions");
  suggestions.innerHTML = "";

  if (data.searchedProducts && data.searchedProducts.length > 0) {
    data.searchedProducts.forEach((product) => {
      const div = document.createElement("div");
      div.classList.add("suggestions-item");
      div.innerHTML = `<div class="product-container">
         <img src="../../user/assets/images/productImages/${product.image[0]}" style="height : 50px; width:50px;" alt="${product.productName}">
           <div>
             <div>${product.productName}</div>
             <small>${product.selectedCategory}</small>
           </div>
           </div>`;
      div.addEventListener("click", async () => showProduct(product));
      suggestions.appendChild(div);
    });
    suggestions.style.display = "block";
  }

  function showProduct(product) {
    window.location.href = `/product-list/${product._id}`;
  }
}
document.addEventListener("click", function (event) {
  const suggestions = document.getElementById("search-suggestions");
  const search_input = document.getElementById("search-input");

  if (
    !suggestions.contains(event.target) &&
    !search_input.contains(event.target)
  ) {
    suggestions.style.display = "none";
  }
});

document.getElementById("search-input").addEventListener("click", function (event) {
    const suggestions = document.getElementById("search-suggestions");
    if (suggestions.children.length > 0) {
      suggestions.style.display = "block";
    }
  });

document.getElementById("selectedFilter1").addEventListener("change", async function () {
    try {
      const clickedCategory = document.querySelector("#clickedCategory").value;
      const selectedFilter = this.value;
      console.log("hihh", selectedFilter, "clickedCategory :", clickedCategory);
      // Send a fetch request to the server to fetch sorted products
      const response = await fetch("/shop-grids", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ selectedFilter, clickedCategory }),
      });

      // Check if the response is successful
      if (!response.ok) {
        throw new Error("Failed to fetch sorted products");
      }
      console.log(response);
      // Parse the JSON response
      const data = await response.json();
      const fullDiv = document.querySelector("#fullProdDivCont");
      fullDiv.innerHTML = "";

      data.products.forEach((product) => {
        const div = document.createElement("div");
        div.classList.add("col");
        div.innerHTML = `<input value="${product.selectedCategory}" id="clickedCategory" hidden>
            <div class="card card-product">
               
               <div class="card-body">
                  
                     <div class="text-center position-relative">
                       
                        <div class="position-absolute top-0 start-0">
                           <span class="badge bg-danger">Sale</span>
                        </div>
                        <a href="shop-single.html">
                           <!-- img -->
                           <img src="../../user/assets/images/productImages/${product.image[0]}" alt="Grocery Ecommerce Template" class="mb-3 img-fluid" />
                        </a>
                        <!-- action btn -->
                        <div class="card-product-action">
                           <a href="#!" class="btn-action" data-bs-toggle="modal" data-bs-target="#quickViewModal">
                              <i class="bi bi-eye" data-bs-toggle="tooltip" data-bs-html="true" title="Quick View"></i>
                           </a>
                           <a href="shop-wishlist.html" class="btn-action" data-bs-toggle="tooltip" data-bs-html="true" title="Wishlist"><i class="bi bi-heart"></i></a>
                           <a href="#!" class="btn-action" data-bs-toggle="tooltip" data-bs-html="true" title="Compare"><i class="bi bi-arrow-left-right"></i></a>
                        </div>
                     </div>
                  
                  <!-- badge -->
                  
                  <!-- heading -->
                  <div class="text-small mb-1">
                     <a href="#!" class="text-decoration-none text-muted"><small>${product.selectedCategory}</small></a>
                  </div>
                  <h2 class="fs-6"><a href="shop-single.html" class="text-inherit text-decoration-none"> ${product.productName}</a></h2>
                  <div>
                     <!-- rating -->
                     <small class="text-warning">
                        <i class="bi bi-star-fill"></i>
                        <i class="bi bi-star-fill"></i>
                        <i class="bi bi-star-fill"></i>
                        <i class="bi bi-star-fill"></i>
                        <i class="bi bi-star-half"></i>
                     </small>
                     <span class="text-muted small">4.5(149)</span>
                  </div>
                  <!-- price -->
                  <div class="d-flex justify-content-between align-items-center mt-3">
                     <div>
                        <span class="text-dark"> ${product.salePrice} </span>
                        <span class="text-decoration-line-through text-muted"> ${product.regularPrice} </span>
                     </div>
                     <!-- btn -->
                     <div>
                        <a href="#!" class="btn btn-primary btn-sm">
                           <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              class="feather feather-plus">
                              <line x1="12" y1="5" x2="12" y2="19"></line>
                              <line x1="5" y1="12" x2="19" y2="12"></line>
                           </svg>
                           Add
                        </a>
                     </div>
                     
                  </div>
                  
               </div>
               
            </div>`;
        fullDiv.append(div);
      });

      // Call a function to update the displayed products with the sorted data
    } catch (error) {
      console.log(error);
    }
  });
