var express = require('express');
var root = express.Router();

root.get('/', (req, res) => {
    res.send("Movie API is working");
    console.log("GET /");
});

module.exports = root;