async function searchInputQuery() {
  const searchedOutputDiv = document.getElementById("searchedOutput");
  searchedOutputDiv.innerHTML = "";
  try {
    const searchInputValue = document.getElementById("searchInput").value;
    let searchQuery = searchInputValue.trim();
    console.log(searchQuery);

    if (searchQuery == "") {
      return (searchedOutputDiv.innerHTML = "");
    } else {
      const response = await fetch("/search", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ searchQuery }),
      });
      if (!response.ok) {
        throw new Error("somthing went wrong while searching products");
      }
      const data = await response.json();
      console.log(data.searchedProducts.length);

      if (data.searchedProducts) {
        data.searchedProducts.forEach((product) => {
          const div = document.createElement("div");
          div.classList.add("search-result-item");
          div.innerHTML = `
          <div class="row">
          <a href='/product-list/${product._id}' class='text-reset'><div class="col-3">
              <img src="/user/assets/images/productImages/${product.image[0]}" class="img-fluid" >
            </div>
            <div class="col-9">
              <a href='/product-list/${product._id}' class='text-reset'><h5 class="card-title">${product.productName}</h5></a>
              <a href='/shop-grid/${product.selectedCategory}' class='text-reset'><p class="card-text">${product.selectedCategory}</p></a>
            </div></a>
          </div>`;
          searchedOutputDiv.appendChild(div);
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
}
