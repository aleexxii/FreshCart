document.addEventListener("DOMContentLoaded", function () {
document.getElementById('addCategorybtn').addEventListener('click',()=>{
    
    // Collect category data from input fields
    const categoryName1 = document.getElementById("categoryName").value;
    const categoryName = categoryName1.trim()
    
    const date = document.getElementById("date").value;
    

    const description1 = document.getElementById("editor").innerHTML; 
    const description = description1.trim()

    const discount1 = document.getElementById("discount").value;
    const discount = discount1.trim()

    if(discount <= 0){
        document.getElementById('discountErr').textContent = 'Please enter a valid discount.'
        document.getElementById('discount').focus()
        return
    }
    
    const fileInput = document.getElementById('fileInput');
    let imageFile = fileInput.files

    if ( !categoryName || !date || !fileInput.files[0] ) {
        return categoryFieldError.innerHTML='Please fill in all required fields'
    }

    try {
        const formData = new FormData();
        formData.append('categoryName' , categoryName)
        formData.append('date' , date)
        formData.append('discount' , discount)
        formData.append('description' , description)

        if (fileInput.files.length > 0) {
            formData.append('file', fileInput.files[0]);
        }
        fetch("/admin/add-category", {
            method: "POST",
            body: formData
        })
        .then(response => {
            
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then(data => {
            // Handle success response
            console.log(data);
            if(data.redirect){
                window.location.href = data.redirect
            }
             if (data.Error) {
                document.getElementById('errorMessage').innerHTML = data.Error 
                document.getElementById('errorMessage').focus()
            }
        })
        .catch(error => {
            // Handle errors
            console.error("Error fetching data:", error);
            
        });
    } catch (error) {
        console.log(error);
    }
});
})

