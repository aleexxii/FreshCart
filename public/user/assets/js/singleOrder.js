async function statusUpdate(selectElement){
    const productId = selectElement.getAttribute('data-product-id')
    const productStatus = selectElement.value
    const userId = document.getElementById('userId').value
    const paymentMethod = document.getElementById('paymentMethod').value
    const totalPrice = document.getElementById('totalPrice').value
    console.log(productId,productStatus);
    try {
        const response = await fetch('./single-order',{
        method : 'post',
        headers : {
            "Content-Type" : "application/json"
        },
        body : JSON.stringify({ productStatus, productId, userId, paymentMethod, totalPrice })
    })
    if(!response){
        throw new Error('something went wrong')
    }
    const data = await response.json()
    if(data.message){
        console.log('updated');
    }
    } catch (error) {
        console.log(error);
    }
  
}







// document.getElementById('updateStatus').addEventListener('click',async ()=>{
//     console.log('clicked');
//     try {
//         const orderStatus = document.getElementById('orderStatus').value
//         const orderId = document.getElementById('orderId').value
//         console.log(orderId,'orderId');
//         console.log(orderStatus,'orderstatus')

//         const response = await fetch('./single-order',{
//             method : 'post',
//             headers : {
//                 "Content-Type" : "application/json"
//             },
//             body : JSON.stringify({orderStatus,orderId})
//         })
//         if(!response){
//             throw new Error('something went wrong')
//         }
//         const data = await response.json()
//         if(data.message){
//             document.getElementById('successMessage').innerHTML = data.message
//         }
//     } catch (error) {
        
//     }
// })