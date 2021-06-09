const express = require('express');
const app = express();
app.use(express.json());
const route_product = express.Router();
const debug = require('debug')('*');
const Product = require('../models/product');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const asyncMiddleware = require('../middleware/async');
require('express-async-errors');

route_product.get('/get_product/:id', async (req, res) => {
        const result = await Product.findById(req.params.id);
        debug('Result: ', result);
        res.send(result);
});

route_product.get('/products', asyncMiddleware(async (req, res) => {
    const result = await Product.find({});
    debug('Result: ', result);
    res.header('Content-Type', 'application/json');
    res.send(JSON.stringify(result));
}));

route_product.post('/add_product' , async (req, res) =>{
    const data = req.body;
    const product = new Product(data);
    const result = await product.save();
    //console.log('Added product: ', result);
    res.header('Content-Type', 'application/json');
    res.send(JSON.stringify(result));
});

route_product.post('/update_product/:id' , async (req, res) =>{
    const data = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return;
    product.set({
            "category": data.category,
            "manufacturer": data.manufacturer,
            "title": data.title,
            "quantity": data.quantity,
        });
    const result = await product.save();
    //console.log('Updated product: ', result);
    res.header('Content-Type', 'application/json');
    res.send(JSON.stringify(result));
});

// [auth, admin] - the order of execution is important
route_product.delete('/delete_product/:id', [auth, admin], (req, res) => {

    Product.findByIdAndDelete(req.params.id, (function (err, docs) {
        if (err) throw err;
        if (docs === null) {
            res.end('No match found');
        } else {
            debug('Product removed: ', docs);
            // return removed entry to the client
            res.end(JSON.stringify(docs));
        }
    }));

});

module.exports = route_product;