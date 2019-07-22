window.addEventListener('load', () => {
    let btn = document.querySelector("div[data-element='referral-button']");

        document.addEventListener('click', (evt) => {
            // if (evt.target.tagName === 'A') {
            //     evt.preventDefault();
            //     console.log(evt.target);
                
            // } 
            evt.preventDefault();
            console.log(evt.target);
        }, false);


    console.log(btn);
}, false);

// let apiKey = 'prtl6749387986743898559646983194';
// let url = `http://partners.api.skyscanner.net/apiservices/browsequotes/v1.0/${country}/${currency}/${locale}/
// ${originPlace}/
// ${destinationPlace}/
// ${outboundPartialDate}/
// ${inboundPartialDate}?
// apiKey=${apiKey}`;

/*
    I may need fetch a list of currencies etc... so users know what to enter.
    https://skyscanner.github.io/slate/?_ga=1.104705984.172843296.1446781555#flights-browse-prices
*/

let flightsData;

async function getFlights () {
    let fetchFlights = await fetch('http://partners.api.skyscanner.net/apiservices/browsequotes/v1.0/FR/eur/en-US/uk/us/anytime/anytime?apikey=prtl6749387986743898559646983194', {
                    mode: 'no-cors',
                    crossOrigin: null,
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json'
                    }
    });
    let json = await fetchFlights.json();
    flightsData = json;
    console.log(fetchFlights);
}

getFlights();

// console.log(flightsData.Quotes);