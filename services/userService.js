// userService.js

const User = require('../models/user'); // Import the User model
const Message = require('../models/message');



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

const unreadCountForUser = async (userId) => {
  try {
    // Assuming you have access to messages and you want to count unread messages
    const messages = await Message.find({ user: userId, isRead: false });
    
    if (messages.length == 0) {
      return null
    } else {
      return messages.length;
    }

    
  } catch (error) {
    console.error(error);
    return 0; // Handle errors gracefully, return 0 if there's an issue
  }
}


module.exports = {
  getUserUsername,
  getIdUsername,
  unreadCountForUser
};