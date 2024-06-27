
document.getElementById("UpdateProduct").addEventListener("click", async () => {
  console.log("button click aayi");

  const product_name = document.getElementById("productName").value.trim();
  const category = document.getElementById("selectedCategory").value;
  const weight = document.getElementById("itemWeight").value.trim();
  const units = document.getElementById("selectUnites").value;
  const product_Code = document.getElementById("product_Code").value;
  const sku = document.getElementById("stock_keeping_unit").value;
  const regular_price = document.getElementById("regular_price").value;
  const sale_price = document.getElementById("sale_price").value;
  const discount = document.getElementById('discount').value
  console.log(discount,'discount');


  const productName_error = document.getElementById("productName_error");
  const category_error = document.getElementById("category_error");
  const weight_error = document.getElementById("weight_error");
  const select_units_error = document.getElementById("select_units_error");
  // const image_error = document.getElementById("image_error");
  const regular_price_error = document.getElementById("regular_price_error");
  const sale_price_error = document.getElementById("sale_price_error");
  const productId = document.getElementById("idField").value;

  productName_error.innerHTML = "";
  category_error.innerHTML = "";
  weight_error.innerHTML = "";
  select_units_error.innerHTML = "";
  // image_error.innerHTML = "";
  regular_price_error.innerHTML = "";
  sale_price_error.innerHTML = "";


  if (product_name === "") {
    productName_error.innerHTML = "Please fill the product name";
    document.getElementById("productName").focus();
    return;
  }
  if (category === "Product Category") {
    category_error.innerHTML = "Please select a category";
    document.getElementById("selectedCategory").focus();
    return;
  }
  if (weight === "" || isNaN(parseFloat(weight)) || parseFloat(weight) <= 0) {
    weight_error.innerHTML = "Please enter a valid weight";
    document.getElementById("itemWeight").focus();
    return;
  }
  if (units === "Select Units") {
    select_units_error.innerHTML = "Please select a unit";
    document.getElementById("selectUnites").focus();
    return;
  }

  const price_regex = /^\d+(\.\d{1,2})?$/;
  if (!price_regex.test(regular_price) || parseFloat(regular_price) <= 0) {
    regular_price_error.innerHTML = "Please enter a valid positive price";
    document.getElementById("regular_price").focus();
    return;
  }
  if (!price_regex.test(sale_price) || parseFloat(sale_price) <= 0) {
    sale_price_error.innerHTML = "Please enter a valid positive price";
    document.getElementById("sale_price").focus();
    return;
  }

  const stockUnits = document.getElementById('stock_error')
    stockUnits.innerHTML = ''
    const stock_regex = /^[1-9][0-9]*$/;
  
    if(!stock_regex.test(sku) || sku < 0){
      stockUnits.innerHTML = 'Please enter a valid unit'
      document.getElementById('stock_keeping_unit').focus()
      return
    }

  const fileInput = document.querySelectorAll("#imageInput");
  const imageFiles = [];

  fileInput.forEach((input) => {
    Array.from(input.files).forEach((file) => {
      imageFiles.push(file);
    });
  });

  // Existing image filenames (assuming they are stored in an array)
const existingImages = Array.from(document.querySelectorAll(".image-item img")).map((img) => img.getAttribute("src").split("/").pop());

// Get the product images
document.querySelectorAll(".image-item img").forEach((img) => {
  existingImages.push(img.getAttribute("src").split("/").pop()); // Extract image name from the src URL
});

  // Access the Quill editor's content
  // const description = quill.root.innerHTML;
  const description = document.getElementById('editor').innerText;
  // description = description.replace(/^<p>/, '');

  try {
    const formData = new FormData();
    formData.append("productName", product_name);
    formData.append("category", category);
    formData.append("weight", parseFloat(weight));
    formData.append("units", units);
    formData.append("productSKU", sku);
    formData.append("productCode", product_Code);
    formData.append("regularPrice", parseFloat(regular_price));
    formData.append("salePrice", parseFloat(sale_price));
    formData.append("description", description);
    formData.append("discount", discount)

// Append existing image filenames
existingImages.forEach((imageName) => {
  formData.append("existingImages", imageName);
});

    for (let i = 0; i < imageFiles.length; i++) {
      formData.append("files", imageFiles[i]);
    }
console.log(imageFiles , 'imagefiles2');
    fetch(`/admin/update-product?productId=${productId}`,
      {
        method: "post",
        body: formData,
      }
    ).then(response => {
        if(!response.ok){
          throw new Error("Something went wrong. Please try again");  
        }
        return response.json()
    }).then(data => {
      if(data.discountErr){
        document.getElementById('discountErr').focus()
        document.getElementById('discountErr').innerHTML = data.discountErr
      }
        if(data.redirect){
          window.location.href = data.redirect;
        }
          else if(data.existingError){
            document.getElementById("product_err").innerHTML = data.existingError;
            document.getElementById("product_err").focus()
          }
    }).catch(error => {
      console.log(error);
    })
}  catch (error) {
  document.getElementById("response-message").innerHTML = error;
  console.log(error);
}
})
