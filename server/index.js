const express = require('express');
const bodyParser = require('body-parser');
const scrape = require('./scrape');
const sendEmail = require('./gmailAPI').sendEmail;
const mongoose = require('mongoose');
const cors = require('cors');
let url;

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
    scrape.scrapePrices(url);
});

app.listen(port, console.log(`listening on port ${port}.`));

