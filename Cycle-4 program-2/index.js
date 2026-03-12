const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// middleware to parse JSON
app.use(bodyParser.json());

// import routes
const router = require('./route/bookRoute ');

// base route
app.use('/books', router);

// start server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
