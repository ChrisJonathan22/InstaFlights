let express = require('express');
let port = 3000;
let app = express();

app.get('/', (req, res) => {
    res.json({
        message: 'Successful request.'
    });
});

app.listen(port, console.log(`listening on port ${port}.`));
