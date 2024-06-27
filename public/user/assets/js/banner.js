document.getElementById('bannerForm').addEventListener('submit',async function(event){
    event.preventDefault()
    const fileInput = document.getElementById('fileInput')
    if(!fileInput.files[0]){
        document.getElementById('errorMessage').textContent = 'Please select an image.'
        document.getElementById('fileInput').focus()
        return
    }
        const formData = new FormData(this);
        const imageFile = document.getElementById('fileInput').files[0];
        formData.set('file', imageFile);


    const response = await fetch('./submit-banner',{
        method :'POST',
        body : formData
    })
    if(!response.ok){
        throw new Error('something went wrong while adding banner')
    }
    const data = await response.json()
if(data.redirect){
    window.location.href = data.redirect
}
    if(data.message){
        document.getElementById('banner-err-msg').innerHTML = data.message
    }
})