const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const { throws } = require('assert')

const Schema = mongoose.Schema

const userSchema = new Schema({
    username: {
        type: String,
        required: [true, 'Please enter a username.'],
        unique: true,
        lowercase: true,
        minlength: [3, 'Minimum username length is 3 characters'],
    },
    password: {
        type: String,
        required: [true, 'Please enter a password.'],
        minlength: [8, 'Minimum password length is 8 characters'],
    }
})

userSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt()
    this.password = await bcrypt.hash(this.password, salt)
    next()
})

//  static method to login user

userSchema.statics.login = async function(username, password) {
    const user = await this.findOne({ username })
    
    if (user) {
        const auth = await bcrypt.compare(password, user.password)
        if (auth) {
            return user
        }
        throw Error('incorrect password')
    }
    throw Error('incorrect username')
}

const User = mongoose.model('user', userSchema)
module.exports = User