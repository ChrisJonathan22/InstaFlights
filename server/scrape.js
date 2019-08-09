const fs = require('fs');
const authorize = require('./gmailAPI').authorize;
const sendEmail = require('./gmailAPI').sendEmail;
const tesseract = require('tesseract.js');
const randomUserAgent = require('random-useragent');
const puppeeter = require('puppeteer');

let scrapePrices = async (url, email, price) => {
    try {
    let browser = await puppeeter.launch( { headless: false } );
    
    let page = await browser.newPage();

    await page.setUserAgent(randomUserAgent.getRandom());

    await page.goto(url);
    
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
        scrapePrices(url, email, price);
        console.log('Function relaunched.');
    }

    else {
        await page.waitFor(5000);
        const element = await page.$('[data-tab="price"] .fqs-price');
        const text = await page.evaluate(element => element.textContent, element);
        let priceAsNumber = text.replace(/\D/g,'');
        priceAsNumber = parseInt(priceAsNumber);
        console.log('price from site', priceAsNumber);
        console.log('price from client', price);

        if (priceAsNumber <= price) {
            console.log('This is the cheapest price', text);
            await page.screenshot({path: 'screenshot.png'});
            console.log('screenshot!');
            await page.waitFor(5000);

            tesseract.recognize('./screenshot.png', {
                lang: 'eng'
            })
            .progress(progress => {
                // console.log('progress', progress.progress);
                let p = (progress.progress * 100).toFixed(2);
                // console.log('this is the status', p);
            })
            .then(result => {
                console.log('result', result.text);
                tesseract.terminate();
            });
            fs.readFile('credentials.json', async (err, content) => {
                if (err) return console.log('Error loading client secret file:', err);
                // Authorize a client with credentials, then call the Gmail API.
                const auth = await authorize(JSON.parse(content));
                console.log('this is the authentication', auth);
                sendEmail(auth, url, text, email);
            });
        }

        else {
            console.log('It\'s too expensive.');
            await browser.close();
            console.log('Browser closed.');
            scrapePrices(url, email, price);
            console.log('Function relaunched.');
        }

        
    }
    await page.waitFor(5000);
    }

    catch (error) {
        console.error(error);
    }
}

module.exports.scrapePrices = scrapePrices;