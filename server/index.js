let express = require('express');
let fs = require('fs');
let cors = require('cors')({ origin: true });
let $ = require('cheerio');
let tesseract = require('tesseract.js');
let randomUserAgent = require('random-useragent');
let puppeeter = require('puppeteer');
let fetch = require('node-fetch');
let extractor = require('unfluff');
let flightsData;
let port = 3000;
let app = express();

const scrapePrices = async username => {
    try {
    let browser = await puppeeter.launch( { headless: false } );
    
    let page = await browser.newPage();

    await page.setUserAgent(randomUserAgent.getRandom());

    await page.goto('https://www.skyscanner.net/transport/flights/pari/lond/190731/?adults=1&children=0&adultsv2=1&childrenv2=&infants=0&cabinclass=economy&rtn=0&preferdirects=false&outboundaltsenabled=false&inboundaltsenabled=false&ref=home#results');
    
    await page.setUserAgent(randomUserAgent.getRandom());
    
    let rand = Math.floor(Math.random() * 1000000) + 1;

    let pageContentAsText = await page.content();
    let isCaptcha = pageContentAsText.includes('Are you a person or a robot?');
    
    if ( isCaptcha ) {
        console.log(`Captcha = isCaptcha`);
        console.log('Wait for 5 seconds and then close the browser.');
        await page.waitFor(5000);
        await browser.close();
        console.log('Browser closed.');
        scrapePrices();
        console.log('Function relaunched.');
    }

    else {
        // If the captcha doesn't show up fast enough this else clause will run
        await page.waitFor(1000);
        page.screenshot({path: `${rand}.png`});
        console.log('screenshot!');
        console.log(`screenshot file name = ${rand}.png`);
        // await browser.close();
    }


    

    // let pageData;

    // Turn image data into text and then find the values

    
    await page.waitFor(5000);
    // page.screenshot({path: 'screentshot.png'});
//     await page.evaluate( () => {
//     let priceElement = document.querySelector('.fqs-type');
//     pageData = priceElement.innerHTML;
//     return priceElement.innerHTML;
// });

    // Reference https://stackoverflow.com/questions/55678095/bypassing-captchas-with-headless-chrome-using-puppeteer

    // await browser.close();

    // console.log(pageData);
}

catch (error) {
    console.error(error);
}
    
    // return data;
  
}

// let image = fs.readFile('./screentshot.png', (err, data) => {
//     if (err) throw err;
//     console.log(data);
//     return data;
// });
// console.log(image);

scrapePrices();

// tesseract.recognize(image, {
//     lang: 'eng'
// })
// .progress(({ progress, status }) => {
//     if (!progress || !status || status !== 'recognizing text') {
//         return null;
//     }
//     let p = (progress * 100).toFixed(2);
//     console.log('this is the status', p);
// });

app.get('/', (req, res) => {
    res.json({
        message: 'Successful request.'
    });
});

app.listen(port, console.log(`listening on port ${port}.`));
