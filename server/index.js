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


app.post('/flights', (req, res) => {
    res.json({
        message: 'Successful request.'
    });
    const obj = JSON.parse(req.body.body);
    url = obj.url;
    email = obj.email;
    price = obj.price;

    const user = new mongooseUsersModel({ email: email, url: url, price: price });
    user.save().then(() => console.log('User details saved.'));

    console.log('This is the user', user);

    console.log(email);
    // Rather than scraping straight away it would be best to loop through all the users
    // and the scrape using the users info from the database
    // I would have to set it up to scrape once a day
    scrape.scrapePrices(url, email, price);
});

app.listen(port, console.log(`listening on port ${port}.`));

