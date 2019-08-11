const express = require('express');
const bodyParser = require('body-parser');
const scrape = require('./scrape');
const mongoose = require('./database').mongooseDB;
const mongooseUsersModel = require('./database').mongooseUsersModel;
// console.log(mongoose);
const cors = require('cors');
let url;
let email;
let price;

const port = 3000;
const app = express();
const corsOptions = {
    origin: "http://192.168.0.18:5500",
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Create a Post route
app.post('/flights', (req, res) => {
    res.json({
        message: 'Successful request.'
    });
    // Turn the response into a JavaScript object
    const obj = JSON.parse(req.body.body);
    // Extract each individual piece of data
    url = obj.url;
    email = obj.email;
    price = obj.price;

    // Create a new user with the data provided
    // TODO: Add a functionality which will check if the user is already in the database
    // TODO: Comment as many more of the code
    // ! This comment highlighting comes from Better Comments
    const user = new mongooseUsersModel({ email: email, url: url, price: price });
    user.save().then(() => console.log('User details saved.'));

    mongooseUsersModel.find((err, users) => {
        if (err) console.log(err);
        else {
            // console.log('Here is a list of all the users... ',users);
            users.forEach(user => {
                console.log('I\'m a user...', user);
                scrape.scrapePrices(user.url, user.email, user.price);
            })
        }
    });

    console.log('This is the user', user);

    console.log(email);
    /* 
    TODO: Rather than scraping straight away it would be best to loop through all the users
    TODO: and the scrape using the users info from the database
    TODO: I would have to set it up to scrape once a day
    TODO: After a user has been scraped store the data into another database to keep track
    TODO: Skip any user who's request has been handled
    TODO: scrape.scrapePrices(url, email, price);
    */ 
});

app.listen(port, console.log(`listening on port ${port}.`));

