const User = require('../models/user')
const jwt = require('jsonwebtoken')
const fs = require('fs');
const path = require('path');

// handle errors
const handleErrors = (err) => {
    console.log(err.message, err.code)
    let errors = { username: '', password: '' }

    // incorrect username
    if (err.message === 'incorrect username') {
        errors.username = 'that username is not registered'
    }

    // incorrect password
    if (err.message === 'incorrect password') {
        errors.password = 'that password is incorrect'
    }

    // duplicate
    if (err.code === 11000) {
        errors.username = 'Username already exists.'
        return errors
    }

    // validations errors
    if (err.message.includes('user validation failed')) {
        Object.values(err.errors).forEach(({properties}) => {
            errors[properties.path] = properties.message
        })
    }

    return errors
}

const maxAge = 3 * 24 * 60 *60
const createToken = (id) => {
    return jwt.sign({ id }, 'bilbob secret', {
        expiresIn: maxAge
    })
}

const signup_get = (req, res) => {
    res.render('signup')
}

const login_get = (req, res) => {
    res.render('login')
}

const signup_post = async (req, res) => {
    const { username, password } = req.body

    try {
        const user = await User.create({ username, password })
        const token = createToken(user._id)
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 })

        const sourcePath = path.join(__dirname, '../public/images/placeholder.png');
        const destinationPath = path.join(__dirname, `../public/images/${user._id}.png`);

        fs.copyFile(sourcePath, destinationPath, (err) => {
            if (err) {
                console.error('Error duplicating file:', err);
                // Handle error
            } else {
                console.log('File duplicated successfully');
                // Handle success
            }
        });

        res.status(201).json({ user: user._id })
    }
    catch (err) {
        const errors = handleErrors(err)
        res.status(400).json({ errors })
    }
}

const login_post = async (req, res) => {
    const { username, password } = req.body

    try {
        const user = await User.login(username, password)
        const token = createToken(user._id)
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 })
        res.status(200).json({ user: user._id })
    }
    catch (err) {
        const errors = handleErrors(err)
        res.status(400).json({ errors })
    }
}



module.exports = {
    signup_get,
    login_get,
    signup_post,
    login_post
}