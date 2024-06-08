const User = require('../models/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const handleErrors = (err) => {

    let errors = { email: '', password: '' };

    if (err.message === 'Incorrect email') {
        errors.email = err.message
    }
    if (err.message === 'Incorrect password') {
        errors.password = err.message
    }

    if (err.code === 11000) { errors.email = 'User already registered' }

    if (err.message.includes('user validation failed')) {
        Object.keys(err.errors).forEach((key) => {
            errors[key] = err.errors[key].message;
        });
    }

    return errors;
}

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: maxAge
    });
}

module.exports.signup_get = (req, res) => {
    res.render('signup', { title: "Signup" });
};

module.exports.signup_post = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.create({ email, password });
        if (user) {
            const token = createToken(user._id);
            res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
            res.status(200).json({ user: user._id });
        } else {
            res.status(400).json({ error: 'Failed to create an user' });
        }
    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json(errors);
    }
};

module.exports.login_get = (req, res) => {
    res.render('login', { title: "Login" });
};

module.exports.login_post = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.login(email, password);
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(200).json({ user: user._id });
    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json(errors);
    }
};

module.exports.logout_get = (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('/login');
};