const express = require('express');
const bodyParser = require('body-parser');
//const headers = require('./middleware/headers');

const app = express();

app.use(bodyParser.json());

require('./routes/goals').init(app);
require('./routes/steps').init(app);

app.listen(3000,() => {
    console.log('Example app listening on port 3000!');
});
