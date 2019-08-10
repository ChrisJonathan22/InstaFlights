const Base64 = require('js-base64').Base64;
const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
// Work on successfully return the authentication object with the credentials from authorize

// Client ID and API key from the Developer Console
const CLIENT_ID = '153961427173-8sn3madr2pcsa54j8lf5c6thk0q07ujo.apps.googleusercontent.com';
const API_KEY = 'AIzaSyBJO6XgMu0sxJK64jtc_PAU677eQWF4yIs';



// If modifying these scopes, delete token.json.
const SCOPES = ['https://mail.google.com/',
'https://www.googleapis.com/auth/gmail.modify',
'https://www.googleapis.com/auth/gmail.compose',
'https://www.googleapis.com/auth/gmail.send'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

// Load client secrets from a local file.
// fs.readFile('credentials.json', (err, content) => {
//   if (err) return console.log('Error loading client secret file:', err);
//   // Authorize a client with credentials, then call the Gmail API.
//   // authorize(JSON.parse(content), sendEmail);
//   authorize(JSON.parse(content), sendEmail);
// });

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
const authorize = async (credentials) => {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  let oAuth2Client = new google.auth.OAuth2(
    client_id, client_secret, redirect_uris[0]);
  
    // I've opted to use the Synchronous readFile method because with the Asynchronous method the value
    // was always undefined
  let content = fs.readFileSync(TOKEN_PATH);  

  if (!content) {
    getNewToken(oAuth2Client);
  }

  oAuth2Client.setCredentials(JSON.parse(content));
  return oAuth2Client;
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

 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */

//  Create email body
const makeBody = (to, from, subject, message) => {
  let str = ["Content-Type: text/plain; charset=\"UTF-8\"\n",
      "MIME-Version: 1.0\n",
      "Content-Transfer-Encoding: 7bit\n",
      "to: ", to, "\n",
      "from: ", from, "\n",
      "subject: ", subject, "\n\n",
      message
  ].join('');

  let encodedMail = Base64.encodeURI(str);
      return encodedMail;
}

// Send email
const sendEmail = (auth, url, price, email) => {
  // console.log('this is the authentication', auth);
  console.log('email', email, 'and price', price);
  const gmail = google.gmail({version: 'v1', auth});
  const raw = makeBody(email,
   'noreply.instaflights@gmail.com', 'Great news! we have found a flight matching your criteria.',
   `The cheapest flight price found is ${price} and here's a link where you can purchase your ticket and here's a screentshot of the website.${url} \n Please do not reply to this email.`);
    gmail.users.messages.send({
      auth: auth,
      userId: 'me',
      resource: {
        raw: raw
      }
  }, (err, res) => {
      // res.send(err || res);
      if (err) {
        console.log('There has been an error', err);
        throw err;
      }
      // else {
      //   console.log('Email successfully sent! status = ', res.status);
      //   console.log(res);
      // }
      else {
        let status = res.status ? res.status : 'Status unavailable';
        console.log('Email successfully sent! status = ', status);
        console.log('Email sent!');
      }
  });
}

module.exports.authorize = authorize;
module.exports.makeBody = makeBody;
module.exports.sendEmail = sendEmail;