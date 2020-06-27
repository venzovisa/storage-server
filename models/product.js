const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Product = mongoose.model(process.env.db_store_products, new Schema({
    category: {
        type: String,
        required: true
    },
    manufacturer: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
        max: Number.MAX_SAFE_INTEGER
    }
}));

module.exports = Product;