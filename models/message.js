const mongoose = require('mongoose')
const Schema = mongoose.Schema

const messageSchema = new Schema({
    user: {
        type: String,
        required: true
    },
    recipient: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    isRead: {
        type: Boolean,
        required: true
    }
}, { timestamps: true })

const Message = mongoose.model('Message', messageSchema)
module.exports = Message