const express = require('express');
const route_user = express.Router();
const {User, validateUser} = require('../models/user');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const _ = require('lodash');
const bcrypt = require('bcrypt');
const auth = require('../middleware/auth');
require('express-async-errors');

route_user.get('/me', auth, async(req, res) => {
   const user = await User.findById(req.user._id).select('-password');
   res.send(user);
});

route_user.post('/register', jsonParser, async (req, res) => {
   const { error } = validateUser(req.body);
   if (error) return res.status(400).send(error.details[0].message);

    try {
        let user = await User.findOne({email: req.body.email});
        if(user) return res.status(400).send('User already registered');
        user = new User(_.pick(req.body, ['name', 'email', 'password']));
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        const result = await user.save();
        const token = user.generateAuthToken();
        res
            .header('Auth-Token', token)
            .header('access-control-expose-headers', 'Auth-Token')
            .send(_.pick(user, ['_id', 'name', 'email']));
    }
    catch(ex){
        console.log(ex.message);
        res.status(400).end();
    }
});

module.exports = route_user;