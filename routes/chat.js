const express = require('express');
const app = express();
app.use(express.json());
const jsonParser = express.json();
const route_chat = express.Router();
const debug = require('debug')('*');
const Chat = require('../models/chat');
const auth = require('../middleware/auth');
//const admin = require('../middleware/admin');
const asyncMiddleware = require('../middleware/async');
require('express-async-errors');

route_chat.get('/chat', async (req, res) => {
    const match = await Chat.findOne({
        "status": "public"
    }).select('messages');

    //debug('Result: ', match.messages);
    res.send(match.messages);
    res.end();
});

route_chat.post('/chat', jsonParser, async (req, res) => {
    const data = req.body;
    //console.log(data);

    const match = await Chat.findOne({
        "status": "public"
    }).select('messages');

    if (match) {

        const result = await Chat.findOne({
            "status": "public"
        });
        result.set({
            "messages": [...match.messages, data.message]
        });
        await result.save();
        debug('Result: ', result);
        res.send(result);
        res.end();
    } else {  
        const newChat = new Chat({
            "date": new Date().toString(),  
            "status":"public",
            "messages": [...data.message]
        });
        const result = await newChat.save();
        res.header('Content-Type', 'application/json');
        res.send(JSON.stringify(result));            
        res.end();
    }
    return; 
});

module.exports = route_chat;