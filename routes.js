const root = require('./root');
const chat = require('./routes/chat');
const product = require('./routes/product');
const order = require('./routes/order');
const user = require('./routes/user');
const auth = require('./routes/auth');

module.exports = [
    chat,
    product,
    order,
    user,
    auth,
    root,
];