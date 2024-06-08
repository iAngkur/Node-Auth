const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const { requireAuth, checkUser } = require('./middleware/authMiddleware');

const app = express();
const PORT = process.env.PORT || 3000;

// middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(cookieParser());

// view engine
app.set('view engine', 'ejs');

// Routes
app.get('*', checkUser);
app.get('/', requireAuth, (req, res) => res.render('home', { title: "Home" }));
app.get('/smoothie', requireAuth, (req, res) => res.render('smoothies', { title: "Smoothies" }));
app.use(authRoutes);


// database connection 
mongoose.connect(process.env.DBURI, {
    dbName: 'node-auth'
}).then(() => console.log('Database connection is ready')).catch((err) => console.log(err));

app.listen(PORT, () => {
    console.log('Server is running on https://localhost:' + PORT);
})