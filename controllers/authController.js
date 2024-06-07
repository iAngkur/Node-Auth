const User = require('../models/User');

const handleErrors = (err) => {
    let errors = {
        email: '',
        password: ''
    };


    if (err.code === 11000) {
        errors.email = 'User already registered'
    }

    if (err.message.includes('user validation failed')) {
        Object.keys(err.errors).forEach((key) => {
            errors[key] = err.errors[key].message;
        });
    }
    return errors;
}

module.exports.signup_get = (req, res) => {
    res.render('signup', { title: "Signup" });
};

module.exports.signup_post = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.create({ email, password });
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(400).json({ error: 'Failed to create an user' });
        }
    } catch (err) {
        const errors = handleErrors(err);
        res.status(500).json(errors);
    }
};

module.exports.login_get = (req, res) => {
    res.render('login', { title: "Login" });
};

module.exports.login_post = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email }).exec();
        if (user && user.password === password) {
            res.status(200).json(user);
        } else {
            res.status(400).json({ error: 'No user found' });
        }
    } catch (err) {
        const errors = handleErrors(err);
        res.status(500).json(errors);
    }
};
