const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Chat = mongoose.model(process.env.db_store_chat, new Schema({
    date: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        required: true,
        max: 7,
        min: 6
    },
  messages: {
        type: [
            {
                date: {
                    type: Date,
                    required: true
                },
                author: {
                    type: String,
                    required: true,
                    min: 2,
                    max: 20
                },
                content: {
                    type: String,
                    required: true,
                    min: 1,
                    max: 999
                }
            }
        ],
        validate: {
            validator: function (v) {
                return v && v.length > 0;
            },
            message: 'Chat list should have at least one item'
        },
        required: true
    }
    },
    {
        collection: process.env.db_store_chat
    }
));

module.exports = Chat;