const express = require('express');
const multer = require('multer')
const fs = require('fs')
const morgan = require('morgan');
const path = require('path')
const mongoose = require('mongoose');
const postRoutes = require('./routes/postRoutes');
const authRoutes = require('./routes/authRoutes');
const messageRoutes = require('./routes/messageRoutes');

const cookieParser = require('cookie-parser');
const { requireAuth, checkUser } = require('./middleware/authMiddleware');
const Post = require('./models/post');
const Users = require('./models/user')
const Message = require('./models/message')
const { Server } = require('socket.io');
const { createServer } = require('node:http');
const messageController = require('./controllers/messageController')
const { getUserUsername } = require('./services/userService');

require("dotenv").config()


const handleError = (err, res) => {
  res
    .status(500)
    .contentType("text/plain")
    .end("Oops! Something went wrong!");
};

const upload = multer({
  dest: "./public/images"
  // you might also want to set some limits: https://github.com/expressjs/multer#limits
});

// express app
const app = express();
const server = createServer(app);
const io = new Server(server);

// middleware & static files
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

// register view engine
app.set('view engine', 'ejs');

let theuser = null;

app.get('*', checkUser)
app.use(checkUser);

// connect to mongodb & listen for requests
const dburi = `${process.env.MONGODB}`;
mongoose.connect(dburi)
  .then((result) => {
    server.listen(3001, () => {
      console.log('Server is running on port 3001');
    });

    let room = null

    io.on('connection', (socket) => {
      socket.on('join', async (data) => {
        const { user, recipient } = data;
        room = `messages:${user < recipient ? user + '-' + recipient : recipient + '-' + user}`;
        socket.join(room);
      })

      socket.on('message', async (data) => {
        const { user, message } = data;
        console.log(user)
        console.log(room); // Check if the room name is correctly generated

        const username= await getUserUsername(user)
        console.log(username)
        // Emit the message to all connected clients in the room
        io.to(room).emit('message', { username, message });
      });

      // app.use((res, next) => {
      //   theuser = res.locals.user;
      //   console.log(res.locals)
      //   next();
      // });

      // setInterval(async () => {
      //   try {
      //     // Query the messages database for new messages with the recipient as the current user
      //     console.log(theuser)
      //     const newMessages = await Message.find({ recipient: theuser, isRead: false });
      
      //     // Iterate over the new messages and send notifications to the client-side
      //     newMessages.forEach(async (message) => {
      //       const { user, content } = message;
      //       const username = await getUserUsername(user);
      //       io.to(room).emit('message', { username, content });
      //     });
      //   } catch (err) {
      //     console.log(err);
      //   }
      // }, 5000);
    });
  })
  .catch((err) => console.log(err));

app.use(express.urlencoded({ extended: true }));
// app.use(morgan('dev'));
app.use((req, res, next) => {
  res.locals.path = req.path;
  next();
});

app.use('/posts', postRoutes);
app.use(authRoutes);
app.use(messageRoutes)

app.post("/upload", upload.single("pfp"), (req, res) => {
    const tempPath = req.file.path;
    const targetPath = path.join(__dirname, `./public/images/${req.body.id}.png`);

    if (['.png', '.jpg', '.jpeg'].includes(path.extname(req.file.originalname).toLowerCase())) {
      fs.rename(tempPath, targetPath, err => {
        if (err) return handleError(err, res);

        res
          .status(200)
          .contentType("text/plain")
          .end("File uploaded!");
      });
    } else {
      fs.unlink(tempPath, err => {
        if (err) return handleError(err, res);

        res
          .status(403)
          .contentType("text/plain")
          .end("Only .png files are allowed!");
      });
    }
  }
);



// routes

app.get('/', requireAuth, (req, res) => {
  Post.find()
    .sort({ createdAt: -1 })
    .then(posts => {
      res.render('index', { title: 'About', posts });
    })
    .catch(err => {
      console.log(err);
      res.status(500).send('Internal Server Error');
    });
});

 // Adjust the interval (in milliseconds) as per your requirements // Adjust the interval (in milliseconds) as per your requirements

// app.get('/messages', requireAuth, async (req, res) => {
//   try {
//     const users = await Users.find();
//     res.render('messages', { users, req });
//   } catch (err) {
//     console.log(err);
//     res.status(500).send('Internal Server Error');
//   }
// });

