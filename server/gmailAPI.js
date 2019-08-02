const Base64 = require('js-base64').Base64;
const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');


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
fs.readFile('credentials.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  // Authorize a client with credentials, then call the Gmail API.
  authorize(JSON.parse(content), sendEmail);
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
const sendEmail = (auth, link, userEmail) => {
  const gmail = google.gmail({version: 'v1', auth});
  const raw = makeBody('christophereko@hotmail.fr', 'freezyjchris@gmail.com', `Great news! we have found a flight matching your criteria.' 'Here's a link ${link} where you can purchase your ticket and here's a screentshot of the website.`);
    gmail.users.messages.send({
      auth: auth,
      userId: 'me',
      resource: {
          raw: raw
      }
  }, (err, res) => {
      res.send(err || res);
  });
}

module.exports.makeBody = makeBody;
module.exports.sendEmail = sendEmail;