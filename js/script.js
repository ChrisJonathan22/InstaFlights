let serverResponseText;
let messageElement = document.querySelector('.server-response-text');

function switchClasses (element, oldClass, newClass) {
    element.classList.remove(oldClass);
    element.classList.add(newClass);
}

function displayMessage (element, message, action) {
    element.innerText = message;
    element.style.display = action;
}

function sendFlightData (data) {
    const flightData = {
        email: "",
        price: 0,
        url: ""
    };
    flightData.email = document.querySelector('.email-input').value;
    flightData.price = document.querySelector('.price-input').value;
    flightData.url = document.querySelector('[data-element="referral-button"] a').href;
    if (flightData.email === "" || flightData.price <= 0) {
        displayMessage(messageElement, 'Please make sure that all fields are filled!', 'block');

        setTimeout(() => {
            displayMessage(messageElement, '', 'none');
        }, 3000);
    }   else {
        axios.post('http://localhost:3000/flights', {
            body: JSON.stringify(flightData)
        })
        .then((res) => {
            console.log(res);
            serverResponseText = res.data.message;
            if (serverResponseText.includes('submitted')) {
                switchClasses(messageElement, 'green', 'red');
            }
            else {
                switchClasses(messageElement, 'red', 'green');
            }
            displayMessage(messageElement, serverResponseText, 'block');

            setTimeout(() => {
                displayMessage(messageElement, '', 'none');
            }, 3000);
        }).catch((err) => {
            console.log(err);
        });
    }    
}

const submitBtn = document.querySelector('.submit-btn');

submitBtn.addEventListener('click', () => {
    sendFlightData();
}, false);



