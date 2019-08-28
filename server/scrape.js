const fs = require('fs');
const authorize = require('./gmailAPI').authorize;
const sendEmail = require('./gmailAPI').sendEmail;
const tesseract = require('tesseract.js');
const randomUserAgent = require('random-useragent');
const puppeeter = require('puppeteer');

// Find a way to scrape one by one rather than doing multiple scrapes.
// Also change each screenshot individually and delete all screenshots at 11:59pm.

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
        console.log(`Captcha = true`);
        console.log('Close the browser after 1 second.');
        await page.waitFor(1000);

        await browser.close();
        console.log('Browser closed.');
        scrapePrices(url, email, price);
        console.log('Function relaunched.');
    }

    else {
        await page.waitFor(10000);
        let screenshotValue

        await page.screenshot({path: `./images/screenshot-${rand}.png`});
        console.log('screenshot!');
        await page.waitFor(5000);

        tesseract.recognize(`./images/screenshot-${rand}.png`, {
            lang: 'eng'
        })
        .progress(progress => {
            // console.log('progress', progress.progress);
            let p = (progress.progress * 100).toFixed(2);
            // console.log('this is the status', p);
        })
        .then(async (result) => {
            console.log('result', result.text);
            // Find numbers followed by £ then add those to an array, remove the pound sign and compare against user price.
            screenshotValue = result.text;
            console.log('this is screenshotValue', screenshotValue);

            if (screenshotValue.match(/£[0-9]{1,}/g) === null) {
                browser.close();
                console.log('Browser closed because the page took too long to show the results.');
                scrapePrices(url, email, price);
                console.log('Function relaunched.');
            }

            else {
                // console.log('Prices extracted from string...', screenshotValue);
                screenshotValue = screenshotValue.match(/£[0-9]{1,}/g)[1].replace(/\D/g,'');
                screenshotValue = parseInt(screenshotValue);
                // Match pound signs followed by one or more numbers and then figure it if those values === or fall under the user price.
                tesseract.terminate();

                if (screenshotValue <= price) {
                    fs.readFile('credentials.json', async (err, content) => {
                        if (err) return console.log('Error loading client secret file:', err);
                        // Authorize a client with credentials, then call the Gmail API.
                        const auth = await authorize(JSON.parse(content));
                        console.log('this is the authentication', auth);
                        sendEmail(auth, url, screenshotValue, email);
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
        });

    }
    await page.waitFor(5000);
    }

    catch (error) {
        console.error(error);
    }
}

module.exports.scrapePrices = scrapePrices;