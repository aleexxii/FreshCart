document.getElementById('location-button').onclick = () => {
    if (navigator.geolocation) {
        const options = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        };
        navigator.geolocation.getCurrentPosition(showPosition, showError, options);
        // Use watchPosition for continuous updates (uncomment if needed)
        console.log(showError);
        console.log(options);
        console.log(showPosition);
        navigator.geolocation.watchPosition(showPosition, showError, options);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
};



function showPosition(position) {

    const lat = position.coords.latitude;
    const lng = position.coords.longitude;

    fetchAddress(lat, lng);
}

function fetchAddress(lat, lng) {
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
        .then(response => response.json())
        .then(data => {
            const addressDetails = data.address;
            document.getElementById('address').value = data.display_name;
            document.getElementById('state').value = addressDetails.state || '';
            document.getElementById('district').value = addressDetails.county || '';
            document.getElementById('city').value = addressDetails.city || addressDetails.town || addressDetails.village || '';
            document.getElementById('pincode').value = addressDetails.postcode || '';
            document.getElementById('landmark').value = addressDetails.suburb || '';
        })
        .catch(error => {
            console.error('Error fetching address:', error);
            document.getElementById('address').value = 'Unable to fetch address.';
        });
}

function showError(error) {

    switch (error.code) {
        case error.PERMISSION_DENIED:
            alert("User denied the request for Geolocation.");
            break;
        case error.POSITION_UNAVAILABLE:
            alert("Location information is unavailable.");
            break;
        case error.TIMEOUT:
            alert("The request to get user location timed out.");
            break;
        case error.UNKNOWN_ERROR:
            alert("An unknown error occurred.");
            break;
    }
}
