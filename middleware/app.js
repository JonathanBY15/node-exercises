const express = require('express');
const app = express();

// Import the items router
const itemsRouter = require('./itemsRouter');

// Accept JSON and URL encoded values
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// home route
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Use the items router for /items endpoints
app.use('/items', itemsRouter);

app.listen(3000, () => {
    console.log('Example app listening on port 3000');
});
