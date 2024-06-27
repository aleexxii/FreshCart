
const delete_modal = document.getElementById('deleteModal');
delete_modal.addEventListener('show.bs.modal',function(event){
    const button = event.relatedTarget;



    const address = button.getAttribute("data-custom-data");
    const addressObj = JSON.parse(address);
    console.log(addressObj , 'address object');

    document.getElementById('addressName').innerHTML = addressObj.firstname
    document.getElementById('addressState').innerHTML = addressObj.state
    document.getElementById('addressDistrict').innerHTML = addressObj.district
    document.getElementById('addressCity').innerHTML = addressObj.city
    document.getElementById('addressPincode').innerHTML = addressObj.pincode
    document.getElementById('addressLandmark').innerHTML = addressObj.landmark
    document.getElementById('addressPhone').innerHTML = addressObj.phone

    document.getElementById('addressDeleteBtn').addEventListener('click' , async()=>{
        try {
            const response = await fetch(`/delete-address/${addressObj._id}`,{
                method : 'delete',
            })
            if(!response){
                throw new Error('Somthing went wrong')
            }
            console.log(response,'response');
            const data = await response.json()
            console.log(data,'data');
            if(data.redirect){
                successMsg.innerHTML = data.message
                window.location.href = data.redirect
            }
        } catch (error) {
            console.log(error);
        }
    })
})