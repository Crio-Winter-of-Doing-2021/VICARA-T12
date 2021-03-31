const Joi = require('joi');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: true,
        minlength: 5,
        maxlength: 225,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String, 
        required: true,
        minlength: 5,
        maxlength: 1024,
    },
});

//class
const User = mongoose.model('User', userSchema);
//object

function validateUser(user){
    const schema = Joi.object({
        name: Joi.string().min(5).max(255).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password : Joi.string().min(5).max(255).required(),
        confirmPassword : Joi.string().min(5).max(255).required()
    });
    return schema.validate(user);
}

exports.User = User;
exports.validate = validateUser;
