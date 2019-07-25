let express = require('express');
let cors = require('cors')({ origin: true });
let $ = require('cheerio');
let puppeeter = require('puppeteer');
let fetch = require('node-fetch');
let extractor = require('unfluff');
let flightsData;
let port = 3000;
let app = express();


async function getFlights () {
    let fetchFlights = await fetch('https://www.skyscanner.net/transport/flights/pari/lond/190731/?adults=1&children=0&adultsv2=1&childrenv2=&infants=0&cabinclass=economy&rtn=0&preferdirects=false&outboundaltsenabled=false&inboundaltsenabled=false&ref=home#results'
    );
    // let json = await fetchFlights.text();
    let json = await extractor(fetchFlights);
    flightsData = json;
    console.log(flightsData);
    console.log(String(flightsData).indexOf('fqs-price'));
    console.log($.load(flightsData));
}

// getFlights();

const scrapePrices = async username => {
    const browser = await puppeeter.launch( { headless: true } );
    const page = await browser.newPage();

    await page.goto('https://www.skyscanner.net/transport/flights/pari/lond/190731/?adults=1&children=0&adultsv2=1&childrenv2=&infants=0&cabinclass=economy&rtn=0&preferdirects=false&outboundaltsenabled=false&inboundaltsenabled=false&ref=home#results');

    // await page.type('.fqs-type');
    await page.waitFor(10000);

    // await page.waitForSelector('.fqs-type', {
    //     visible: true
    // });

    

    const data = await page.evaluate( () => {
        const priceElement = document.querySelector('span');
        return priceElement.innerHTML;
    });

    await browser.close();

    console.log(data);
    
    // return data;
  
}

scrapePrices();



app.get('/', (req, res) => {
    res.json({
        message: 'Successful request.'
    });
});

app.listen(port, console.log(`listening on port ${port}.`));
