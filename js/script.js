const flightData = {
    email: "",
    price: 0,
    url: ""
};

function sendFlightData(data) {
    axios.post('http://localhost:3000/flights', {
        body: JSON.stringify(data)
    })
    .then((res) => {
        console.log(res);
    }).catch((err) => {
        console.log(err);
    });
}

const submitBtn = document.querySelector('.submit-btn');

submitBtn.addEventListener('click', () => {
    flightData.email = document.querySelector('.email-input').value;
    flightData.price = document.querySelector('.price-input').value;
    flightData.url = document.querySelector('[data-element="referral-button"] a').href;
    sendFlightData(flightData);
}, false);




