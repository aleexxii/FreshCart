document.getElementById("createProduct").addEventListener("click", async () => {
  console.log("button click aayi");

  const product_name = document.getElementById("productName").value;
  const productName = product_name.trim();
  const category = document.getElementById("selectedCategory").value;
  const weight = document.getElementById("itemWeight").value.trim();
  const units = document.getElementById("selectUnits").value;
  const product_Code = document.getElementById("product_Code").value;
  const sku = document.getElementById("stock_keeping_unit").value;
  const regular_price = document.getElementById("regular_price").value;
  const sale_price = document.getElementById("sale_price").value;
  const description = document.getElementById("editor").innerText;
  console.log(description, "description");

  const productName_error = document.getElementById("productName_error");
  productName_error.innerHTML = "";
  if (productName == "") {
    productName_error.innerHTML = "please fill the product name";
    document.getElementById("productName").focus();
    return;
  }
  if (category === "Product Category") {
    category_error.innerHTML = "Please select a category";
    document.getElementById("selectedCategory").focus();
    return;
  }

  const weight_error = document.getElementById("weight_error");
  weight_error.innerHTML = "";
  const weight_regex = /^0?\.[0-9]+|[1-9][0-9]*(\.[0-9]+)?\s*(kg|L)$/i;

  if (!weight_regex.test(weight) || weight < 0) {
    weight_error.innerHTML = "Please enter a valid weight in kg or L";
    document.getElementById("itemWeight").focus();
    return;
  }
  if (units === "Select Units") {
    select_units_error.innerHTML = "Please select a unit";
    document.getElementById("selectUnites").focus();
    return;
  }

  const price_regex = /^\d+(\.\d{1,2})?$/;
  if (!price_regex.test(regular_price) || regular_price <= 0) {
    regular_price_error.innerHTML = "Please enter a valid positive price";
    document.getElementById("regular_price").focus();
    return;
  }
  const sale_price_regex = /^\d+(\.\d{1,2})?$/;
  if (!sale_price_regex.test(sale_price) || sale_price <= 0) {
    sale_price_error.innerHTML = "Please enter a valid positive price";
    document.getElementById("sale_price").focus();
    return;
  }

  const stockUnits = document.getElementById("stock_error");
  stockUnits.innerHTML = "";
  const stock_regex = /^[1-9][0-9]+(\.[0-9]+)?$/;

  if (!stock_regex.test(sku) || sku < 0) {
    stockUnits.innerHTML = "Please enter a valid unit";
    document.getElementById("stock_keeping_unit").focus();
    return;
  }

  const imageContainer = document.getElementById("imageContainer");
  const imageItems = imageContainer.querySelectorAll(".imageItem img");
  let imageFile = [];

  imageItems.forEach((img) => {
    const src = img.src;

    // EXTRACT Base64 data from src attribute
    const base64Data = src.split(",")[1];

    // Create a Blob object from the Base64 data
    const blob = b64toBlob(base64Data, "image/jpeg");

    // Create a File object from the Blob
    const file = new File([blob], `image${Date.now()}.jpeg`, {
      type: "image/jpeg",
    });

    imageFile.push(file);
  });

  // Function to convert Base64 to Blob
  function b64toBlob(b64Data, contentType = "", sliceSize = 512) {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }
  try {
    // Create FormData object to send to backend
    const formData = new FormData();
    formData.append("productName", productName);
    formData.append("selectedCategory", category);
    formData.append("itemWeight", weight);
    formData.append("selectUnits", units);
    formData.append("product_Code", product_Code);
    formData.append("stock_keeping_unit", sku);
    formData.append("regular_price", regular_price);
    formData.append("sale_price", sale_price);
    formData.append("description", description);

    for (let i = 0; i < imageFile.length; i++) {
      formData.append("files", imageFile[i]);
    }

    // Send form data to backend
    const response = await fetch("/admin/addNewProduct", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Something went wrong. Please try again.");
    }

    const responseData = await response.json();
    console.log(responseData, "response data"); // Log the response data
    // Do something with the response, like displaying a success message or redirecting the user
    window.location.href = "./products"; // redirect the page after successful upload
  } catch (error) {
    console.error("Error:", error);
  }
});
