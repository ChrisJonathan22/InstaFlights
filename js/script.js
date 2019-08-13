const flightData = {
    email: "",
    price: 0,
    url: ""
};

let serverResponseText;
let messageElement = document.querySelector('.server-response-text');

function sendFlightData(data) {
    axios.post('http://localhost:3000/flights', {
        body: JSON.stringify(data)
    })
    .then((res) => {
        console.log(res);
        serverResponseText = res.data.message;
        if (serverResponseText.includes('submitted')) {
            messageElement.classList.add('red');
        }
        else {
            messageElement.classList.add('green');
        }
        messageElement.innerText = serverResponseText;
        messageElement.style.display = 'block';

        setTimeout(() => {
            messageElement.style.display = 'none';
            messageElement.innerText = '';
        }, 3000);
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



