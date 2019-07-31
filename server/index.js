const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const fs = require('fs');
const cors = require('cors');
const tesseract = require('tesseract.js');
const randomUserAgent = require('random-useragent');
const puppeeter = require('puppeteer');
const Base64 = require('js-base64').Base64;
const port = 3000;
const app = express();
const corsOptions = {
    origin: "http://192.168.0.18:5500",
    optionsSuccessStatus: 200
};
let link;
app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const scrapePrices = async (url) => {
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
        scrapePrices();
        console.log('Function relaunched.');
    }

    else {
        await page.waitFor(5000);
        const element = await page.$('[data-tab="price"] .fqs-price');
        const text = await page.evaluate(element => element.textContent, element);
        
        console.log('This is the cheapest price', text);
        page.screenshot({path: 'screenshot.png'});
        console.log('screenshot!');
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


app.post('/flights', (req, res) => {
    res.json({
        message: 'Successful request.'
    });
    const obj = JSON.parse(req.body.body);
    link = obj.link;
    // console.log(obj.price);
    console.log(link);
    scrapePrices(link);
});





app.listen(port, console.log(`listening on port ${port}.`));


// Gmail api information

// Client ID
// 153961427173-8sn3madr2pcsa54j8lf5c6thk0q07ujo.apps.googleusercontent.com

// Client Secret
// j8gPYl-Hjbiwb6-p1hGFrIwS

// API KEY
// AIzaSyBJO6XgMu0sxJK64jtc_PAU677eQWF4yIs

// Client ID and API key from the Developer Console
const CLIENT_ID = '153961427173-8sn3madr2pcsa54j8lf5c6thk0q07ujo.apps.googleusercontent.com';
const API_KEY = 'AIzaSyBJO6XgMu0sxJK64jtc_PAU677eQWF4yIs';

// Array of API discovery doc URLs for APIs used by the quickstart
// var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest"];

const readline = require('readline');
const {google} = require('googleapis');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

// Load client secrets from a local file.
fs.readFile('credentials.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  // Authorize a client with credentials, then call the Gmail API.
  authorize(JSON.parse(content), listLabels);
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

/**
 * Lists the labels in the user's account.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listLabels(auth) {
  const gmail = google.gmail({version: 'v1', auth});
  gmail.users.labels.list({
    userId: 'me',
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
    const labels = res.data.labels;
    if (labels.length) {
      console.log('Labels:');
      labels.forEach((label) => {
        console.log(`- ${label.name}`);
      });
    } else {
      console.log('No labels found.');
    }
  });
}

function sendMessage(userId, email, callback) {
    // Using the js-base64 library for encoding:
    // https://www.npmjs.com/package/js-base64
    var base64EncodedEmail = Base64.encodeURI(email);
    var request = google.gmail.users.messages.send({
      'userId': userId,
      'resource': {
        'raw': base64EncodedEmail
      }
    });
    request.execute(callback);
  }

  sendMessage('me');