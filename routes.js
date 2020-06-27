const root = require('./root');
const product = require('./routes/product');
const order = require('./routes/order');
const user = require('./routes/user');
const auth = require('./routes/auth');

module.exports = [
    product,
    order,
    user,
    auth,
    root
];