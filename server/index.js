const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const fs = require('fs');
const cors = require('cors');
const tesseract = require('tesseract.js');
const randomUserAgent = require('random-useragent');
const puppeeter = require('puppeteer');
const port = 3000;
const app = express();
const corsOptions = {
    origin: "http://192.168.0.18:5500",
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
const scrapePrices = async () => {
    try {
    let browser = await puppeeter.launch( { headless: false } );
    
    let page = await browser.newPage();

    await page.setUserAgent(randomUserAgent.getRandom());

    await page.goto('https://www.skyscanner.net/transport/flights/pari/lond/190731/?adults=1&children=0&adultsv2=1&childrenv2=&infants=0&cabinclass=economy&rtn=0&preferdirects=false&outboundaltsenabled=false&inboundaltsenabled=false&ref=home#results');
    
    await page.setUserAgent(randomUserAgent.getRandom());
    
    let rand = Math.floor(Math.random() * 1000000) + 1;

    await page.waitFor(10000);

    let pageContentAsText = await page.content();

    let isCaptcha = pageContentAsText.includes('Are you a person or a robot?');
    
    if ( isCaptcha ) {
        console.log(`Captcha = isCaptcha`);
        console.log('Wait for 1 seconds and then close the browser.');
        await page.waitFor(1000);

        await browser.close();
        console.log('Browser closed.');
        scrapePrices();
        console.log('Function relaunched.');
    }

    else {
        await page.waitFor(5000);
        const element = await page.$('[data-tab="price"] .fqs-price');
        const text = await page.evaluate(element => element.textContent, element);
        
        console.log('This is the cheapest price', text);
        page.screenshot({path: 'screenshot.png'});
        // page.screenshot({path: `${rand}.png`});
        console.log('screenshot!');
        // console.log(`screenshot file name = ${rand}.png`);
        // https://cdn8.openculture.com/2018/11/21001706/Junius.jpg
        await page.waitFor(5000);

        tesseract.recognize('./screenshot.png', {
            lang: 'eng'
        })
        .progress(progress => {
            console.log('progress', progress.progress);
            let p = (progress.progress * 100).toFixed(2);
            console.log('this is the status', p);
        })
        .then(result => {
            console.log('result', result.text);
            tesseract.terminate();
        });
    }
    await page.waitFor(5000);
    }

    catch (error) {
        console.error(error);
    }
}

// scrapePrices();

app.post('/flights', (req, res) => {
    res.json({
        message: 'Successful request.'
    });
    const obj = JSON.parse(req.body.body);
    // console.log(obj.price);
    console.log(obj);
});

app.listen(port, console.log(`listening on port ${port}.`));
