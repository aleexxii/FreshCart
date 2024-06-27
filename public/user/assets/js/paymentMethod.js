document.getElementById('paymentMethodBtn').addEventListener('click',async()=>{
    const response = await fetch('/account-payment-method')
})