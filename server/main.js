const express = require('express');
const bodyParser = require('body-parser');
//const headers = require('./middleware/headers');

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
});

require('./routes/goals').init(app);
require('./routes/steps').init(app);

app.listen(3000,() => {
    console.log('Example app listening on port 3000!');
});
