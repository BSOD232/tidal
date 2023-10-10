const mongoose = require('mongoose')
const Schema = mongoose.Schema

const postSchema = new Schema({
    id: {
        type: String,
        required: true
    },
    user: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true,
        maxlength: 50
    },
    body: {
        type: String,
        required: true,
        maxlength: 1250
    }
}, { timestamps: true })

const Post = mongoose.model('Post', postSchema)
module.exports = Post