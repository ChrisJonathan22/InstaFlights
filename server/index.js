/* 
TODO: Create a function which will find all users and fetch their flights
TODO: Run the function when the app starts but also call the function when new users are added to the database
*/ 

// TODO: Comment as many more of the code
// ! This comment highlighting comes from Better Comments

const express = require('express');
const bodyParser = require('body-parser');
const scrape = require('./scrape');
const mongoose = require('./database').mongooseDB;
const mongooseUsersModel = require('./database').mongooseUsersModel;
const cors = require('cors');
const fs = require('fs');

const port = 3000;
const app = express();
const corsOptions = {
    origin: "http://192.168.0.18:5500",
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// * Create a Post route

app.post('/flights', (req, res) => {
    // * Turn the response into a JavaScript object
    const obj = JSON.parse(req.body.body);

    // * Extract each individual piece of data
    let { url, email, price } = obj;

    let isUser;

    // * Find all the users within the database
    mongooseUsersModel.find( async (err, users) => {
        if (err) console.log(err);
        else {
            // * For each post request check if the new request email is in the database
            isUser = await users.filter(user => {
                console.log(user);
                return user.email === email;
            });
            console.log('the value of isUser', isUser);

            // * If it is in the database send this response
            if (isUser[0] !== undefined) {
                console.log('Email found in database.');
                res.json({
                    message: 'You\'ve previously submitted a request.'
                });
            } // * If not then add it to the database and send this response 
            else {
                const user = new mongooseUsersModel({ email: email, url: url, price: price, date: new Date() });
                user.save().then(() => console.log('User details saved.'));
                res.json({
                    message: 'Your request has been successfully received.'
                });
            }
        }
        // * Go through a list of users found on the database
        users.forEach(user => {
            // * For each user read a file which contains a list of scraped users
            
            fs.readFile('./scrapedAccounts.json', (err, file) => {
                let data = JSON.parse(file).scrapedList;
                // * If the email is found log a message and if not
                if (data.indexOf(user.email) >= 0) {
                    console.log('The data has been previously scraped for this email.');
                } // * scrape the data and add the email to the list of scraped users
                else {
                    // scrape.scrapePrices(user.url, user.email, user.price);
                    data.push(user.email)
                    let scrapedAccounts = {
                        "scrapedList": data
                    };
                    scrapedAccounts = JSON.stringify(scrapedAccounts);
                    fs.writeFile('./scrapedAccounts.json', scrapedAccounts, (err) => {
                        if (err) console.log('Error writing file', err);
                        else {
                            console.log('Successfully added the email to the JSON file containing the scraped list.');
                        }
                    });
                }
            });
        });
    });
});



mongooseUsersModel.find((err, users) => {
    if (err) console.log(err);
    else {
        // TODO: Push users into the scraped users array and give them a property of isScraped = true
        // console.log('Here is a list of all the users... ',users);
        users.forEach(user => {
            // console.log('I\'m a user...', user);
            fs.readFile('./scrapedAccounts.json', (err, file) => {
                let data = JSON.parse(file).scrapedList;
                if (data.indexOf(user.email) >= 0) {
                    console.log('The data has been previously scraped for this email.');
                } else {
                    // scrape.scrapePrices(user.url, user.email, user.price);
                    // data.push(user.email);
                }
            });
            
        });
    }
});


app.listen(port, console.log(`listening on port ${port}.`));



