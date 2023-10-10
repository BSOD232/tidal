const Message = require('../models/message');
const Users = require('../models/user')
const { getUserUsername, getIdUsername } = require('../services/userService');

const message_index = async (req, res) => {
  try {
      const users = await Users.find();
      const messages = await Message.find();
      const usernames = await Promise.all(messages.map(message => getUserUsername(message.user)));
      const pfps = await Promise.all(messages.map(message => getIdUsername(message.user)))
      const user = res.locals.user.id

      messages.forEach((message, index) => {
        console.log(message)
        
        if ((message.recipient === req.query.user && message.user === user) || (message.recipient === user && message.user === req.query.user)) {
          console.log(message.message)
        }
      }) 

      res.render('messages', { users, req, messages, usernames, pfps });
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