document.getElementById('resetPassBtn').addEventListener('click' , async function (){
    console.log('clicked');
    const email = document.getElementById('FormForgetEmail').value.trim()
    try {
        const response = await fetch('/forgot-password' , {
            method : 'post' ,
            headers : {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify({email})
        })
        if(!response.ok){
            throw new Error("Something went wrong. Please try again");
        }
        else{
            const data = await response.json()
            if(data.redirect){
                console.log(data.redirect);
                // window.location.href = data.redirect
            }
        }
        
    } catch (error) {
        
    }
})