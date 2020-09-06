const express = require('express');
const route_user = express.Router();
const {User, validateUser} = require('../models/user');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const _ = require('lodash');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');
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
        if (user) return res.status(400).send('User already registered');
        user = new User(_.pick(req.body, ['name', 'email', 'password']));
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        await user.save();
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

route_user.post('/user', jsonParser, async (req, res) => {
    const token = req.header('Auth-Token');
    if (!token) return (res.status(401).send('Access token required'));
    let email;
    jwt.verify(token, config.get('jwtPrivateKey'), function(err, decoded) {
        if (err) res.status(400).send('Invalid token.');
        email = decoded.email;
    });

    //
    // const { error } = validateUser(req.body);
    // if (error) return res.status(400).send(error.details[0].message);
    //
     try {
        let user = await User.findOne({email: email});
        if(!user) return res.status(400).send('User not existing');

        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if(!validPassword) return res.status(400).send('Invalid password');

        if (req.body.password === req.body.passwordNew) return res.status(400).send('Current and new password cannot be the same');

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(req.body.passwordNew, salt);
        await user.save();
        const token = user.generateAuthToken();
        res
            .header('Auth-Token', token)
            .header('access-control-expose-headers', 'Auth-Token')
            .send(_.pick(user, ['_id', 'name', 'email']));
         res.status(200).send('Password changed').end();
 }
   catch(ex){
        console.log(ex.message);
        res.status(400).end();
   }
});

module.exports = route_user;