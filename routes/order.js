const express = require('express');
const app = express();
app.use(express.json());
const route_order = express.Router();
const debug = require('debug')('*');
const Order = require('../models/order');
const auth = require('../middleware/auth');
require('express-async-errors');

route_order.post('/add_order',async (req, res) => {
    res.header('Content-Type', 'application/json');
    if (!req.body) return res.sendStatus(400);
    const order = new Order({
        products: req.body.products,
        active: req.body.active
    });
    try {
        const result = await order.save();
        res.send(req.body);
    }
    catch(ex){
       console.log(ex.message);
       res.status(400).end();
    }
});

route_order.get('/order/:id', async (req, res) => {
    const _id = req.params.id;
    const order = await Order
        .findById(_id)
        .populate('products', 'title quantity -_id')
        .select('products active -_id');

    //console.log(order);
    res.end();
});

route_order.get('/orders', auth,(req, res) => {

    Order.find({}, (function (err, docs) {
        debug('Result: ', docs);
        if (err) throw err;
        res.end(JSON.stringify(docs));
    }));

});

route_order.post('/update_order_status' , async (req, res) =>{
    res.header('Content-Type', 'application/json');
    if (!req.body) return res.sendStatus(400);
    const _id = req.body._id;
    const active = req.body.active;
    await Order.findByIdAndUpdate(
        { _id },
        { $set: {
                "active": active
            }
        }, (function (err, docs) {
            if (err) throw err;
            res.end(JSON.stringify(docs));
        }));
});

module.exports = route_order;