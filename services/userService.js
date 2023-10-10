// userService.js

const User = require('../models/user'); // Import the User model

const getUserUsername = async (userId) => {
  try {
    const user = await User.findById(userId);
    return user.username;
  } catch (err) {
    console.log(err);
    throw new Error('Failed to get user username');
  }
};

const getIdUsername = async (username) => {
  try {
    const user = await User.findById(username);
    return user.id;
  } catch (err) {
    console.log(err);
    throw new Error('Failed to get user id');
  }
};

module.exports = {
  getUserUsername,
  getIdUsername
};