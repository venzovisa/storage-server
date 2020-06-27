const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Order = mongoose.model(process.env.db_store_orders, new Schema({
    products: {
        type: [
            {
                _id: {
                    type: mongoose.Schema.Types.ObjectID,
                    ref: process.env.db_store_products
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: 0,
                    max: Number.MAX_SAFE_INTEGER
                }
            }
        ],
        validate: {
            validator: function(v){
                return v && v.length > 0;
            },
            message: 'Products list should have at least one item'
        },
        required: true
    },
    active: {
        type: Boolean,
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectID,
        ref: process.env.db_store_products
    }
}));

module.exports = Order;