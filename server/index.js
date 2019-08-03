const express = require('express');
const bodyParser = require('body-parser');
const scrape = require('./scrape');
const makeEmailBody = require('./gmailAPI').makeBody;
const sendEmail = require('./gmailAPI').sendEmail;
const mongoose = require('mongoose');
const cors = require('cors');
let link;

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
    link = obj.link;
    console.log(link);
    scrape.scrapePrices(link);
});


sendEmail();


app.listen(port, console.log(`listening on port ${port}.`));

