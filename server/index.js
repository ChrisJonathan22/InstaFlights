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
const resetScrapeList = require('./functions').resetScrapeList;
const checkIfScrapedAndScrape = require('./functions').checkIfScrapedAndScrape;
const cors = require('cors');
const schedule = require('node-schedule');

var j = schedule.scheduleJob({hour: 23, minute: 59}, function(){
    resetScrapeList();
});

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
        if (err) console.error(err);
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
        checkIfScrapedAndScrape(users);
    });
});

mongooseUsersModel.find((err, users) => {
    if (err) console.error(err);
    else {
        checkIfScrapedAndScrape(users);
    }
});


app.listen(port, console.log(`listening on port ${port}.`));



