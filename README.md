# InstaFlights

InstaFlights allows users to select a flight and a price they’re willing to pay for the flight, a search will be conducted and if there's a match an email will be sent to the user.

It’s built with HTML, CSS, JS & Node JS + NPM packages such as googleapis, mongoose, node-schedule, puppeteer, tesseract and a few more which can be found within the package.json file.

To work with this project, run npm install then whilst within the root of the project run npm run server and open the index.html file in your browser.

Once a request has been submitted in the Front End, the information will be saved in the database and then using puppeteer the url will be visited, a screenshot will be taken and saved, tesseract will read the screenshot file and output the data as a string, the string will be used to extract the needed information and then finally an email will be sent to the user with the information found.
