const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// middleware
app.use(express.static(path.join(__dirname, 'public')));

// view engine
app.set('view engine', 'ejs');

// Routes
app.get('/', (req, res) => {
    res.render('home');
});

app.get('/smoothie', (req, res) => {
    res.render('smoothies');
});

// database connection 
mongoose.connect(process.env.DBURI, {
    dbName: 'node-auth'
}).then(() => console.log('Database connection is ready')).catch((err) => console.log(err));


app.listen(PORT, () => {
    console.log('Server is running on https://localhost:' + PORT);
})