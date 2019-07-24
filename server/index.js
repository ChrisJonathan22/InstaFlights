let express = require('express');
let fetch = require('node-fetch');
let flightsData;
let port = 3000;
let app = express();


async function getFlights () {
    let fetchFlights = await fetch('https://www.skyscanner.net/transport/flights/pari/lond/190731/?adults=1&children=0&adultsv2=1&childrenv2=&infants=0&cabinclass=economy&rtn=0&preferdirects=false&outboundaltsenabled=false&inboundaltsenabled=false&ref=home#results'
    );
    let json = await fetchFlights.text();
    flightsData = json;
    console.log(flightsData);
    console.log(String(flightsData).indexOf('fqs-price'));
}

getFlights();

app.get('/', (req, res) => {
    res.json({
        message: 'Successful request.'
    });
});

app.listen(port, console.log(`listening on port ${port}.`));
