const Joi = require('@hapi/joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const jwt = require('jsonwebtoken');
const config = require('config');

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024,
    },
    isAdmin: Boolean
},
    {
        collection: process.env.db_store_users
    }
);

userSchema.methods.generateAuthToken = function(){
   return jwt.sign({_id: this._id, isAdmin: this.isAdmin, email: this.email, name: this.name}, config.get('jwtPrivateKey'), { expiresIn: 3600 });
};

const User = mongoose.model(process.env.db_store_users, userSchema);

function validateUser(user){
    const schema = Joi.object({
            name: Joi.string().min(5).max(50).required(),
            email: Joi.string().min(5).max(255).required().email(),
            password: Joi.string().min(5).max(255).required()
        });
    return schema.validate(user);
}

module.exports.User = User;
module.exports.validateUser = validateUser;

