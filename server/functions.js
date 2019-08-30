const fs = require('fs');
const scrape = require('./scrape');

// Function to reset scrape list
function resetScrapeList() {
    fs.readFile('./scrapedAccounts.json', (err, file) => {
        if (err) console.error('There\'s been an error trying to read the file');
        else {
            let scrapedAccounts = {
                "scrapedList": []
            };
            scrapedAccounts = JSON.stringify(scrapedAccounts);
            fs.writeFile('./scrapedAccounts.json', scrapedAccounts, (err) => {
                if (err) console.log('Error writing file', err);
                else {
                    console.log('Successfully reset JSON file containing the scraped list.');
                }
            });
        }
    });
}

// * If scraped do nothing else scrape
function checkIfScrapedAndScrape(users) {
    // * Go through a list of users found on the database
    users.forEach(user => {
        // * For each user read a file which contains a list of scraped users

        scrape.scrapePrices(user.url, user.email, user.price);

        fs.readFile('./scrapedAccounts.json', (err, file) => {
            let data = JSON.parse(file).scrapedList;
            // * If the email is found log a message and if not
            if (data.indexOf(user.email) >= 0) {
                console.log('The data has been previously scraped for this email.');
            } // * scrape the data and add the email to the list of scraped users
            else {
                console.log('User scraped');
                scrape.scrapePrices(user.url, user.email, user.price);
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
}

module.exports.resetScrapeList = resetScrapeList;
module.exports.checkIfScrapedAndScrape = checkIfScrapedAndScrape;