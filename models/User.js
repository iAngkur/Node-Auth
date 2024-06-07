const mongoose = require('mongoose');
const { isEmail } = require('validator');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please enter an email'],
        unique: true,
        lowercase: true,
        validate: [isEmail, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Please enter a password'],
        minlength: [6, 'Minimum password length is 6 characters']
    }
});

// Fire a function after the document saved to the DB
userSchema.post('save', function (doc, next) {
    console.log('A new user is created: \n' + doc);
    next();
});

// Fire a function before a document saved to the DB
userSchema.pre('save', function (next) {
    console.log(this);
    next();
});

const User = mongoose.model('user', userSchema);

module.exports = User;