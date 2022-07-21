const express = require('express');
const connectToMongo = require('./db');

const app = express();
const port = 5000;

connectToMongo();

app.use('/api/auth', require('./routes/auth.js'))
app.use('/api/notes', require('./routes/notes.js'))

app.get('/', (req, res) => {
    res.send("Hello World");
})


app.listen(port, () => {
    console.log("Up and running");
})