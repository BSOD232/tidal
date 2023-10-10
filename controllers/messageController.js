const Message = require('../models/message');
const Users = require('../models/user')
const { getUserUsername, getIdUsername, unreadCountForUser } = require('../services/userService');

const message_index = async (req, res) => {
  try {
      const users = await Users.find();
      const messages = await Message.find();
      const usernames = await Promise.all(messages.map(message => getUserUsername(message.user)));
      const pfps = await Promise.all(messages.map(message => getIdUsername(message.user)))
      const unreadCounts = await Promise.all(users.map(userb => unreadCountForUser(userb.id)));
      const user = res.locals.user.id

      let unreadCount = 0;


      if (req.query.user) {
        messages.forEach(async (message, index) => {
      
          // Convert ObjectId values to strings for comparison
          const recipientId = message.recipient.toString();
          const userId = user.toString();
        
          // Check if the message involves the current user
          const isMessageToUser = recipientId === userId;
          const isMessageFromUser = message.user.toString() === userId;
        
          if (isMessageToUser && !isMessageFromUser && !message.isRead) {
        
            // Update the 'isRead' property of the message to true
            await Message.findByIdAndUpdate(message._id, { isRead: true });
  
            unreadCount++;
          }
        });
      }

      

      res.render('messages', { users, req, messages, usernames, pfps, unreadCounts });
  } catch (err) {
      console.log(err);
      res.status(500).send('Internal Server Error');
  }
};

const message_create_message = (req, res) => {
  const message = new Message(req.body);
  console.log(message)
  message.save()
    .then(result => {
      res.redirect('#');
    })
    .catch(err => {
      console.log(err);
    });
}

// const blog_delete = (req, res) => {
//   const id = req.params.id;
//   Blog.findByIdAndDelete(id)
//     .then(result => {
//       res.json({ redirect: '/blogs' });
//     })
//     .catch(err => {
//       console.log(err);
//     });
// }

module.exports = {
    message_create_message,
    message_index
}