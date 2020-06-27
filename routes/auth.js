const express = require('express');
const route_auth = express.Router();
const {User} = require('../models/user');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const _ = require('lodash');
const bcrypt = require('bcrypt');
const Joi = require('@hapi/joi');
const jwt = require('jsonwebtoken');
const config = require('config');

function validate(user){
    const schema = Joi.object({
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required()
    });
    return schema.validate(user);
}

route_auth.post('/auth', jsonParser, async (req, res) => {
    try {
        const { error } = validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        let user = await User.findOne({email: req.body.email});
        if(!user) return res.status(400).send('Invalid email');

        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if(!validPassword) return res.status(400).send('Invalid password');

        const token = user.generateAuthToken();
        res
            .header('Auth-Token', token)
            .send({'authToken': token});
    }
    catch(ex){
        console.log(ex.message);
        res.status(400).end();
    }
});

route_auth.get('/isLogged', jsonParser, (req, res) => {
    const token = req.header('Auth-Token');
    if (!token) return (res.status(401).send('Access token required'));
    try {
        req.user = jwt.verify(token, config.get('jwtPrivateKey'), err => {
            if (err) {
                console.log(err.message);
                return res.status(401);
            }
        });
    }
    catch (ex) {
        res.status(400).send('Invalid token.');
    }
    res.status(200).end();
});

module.exports = route_auth;