const Post = require('../models/post');
const fs = require('fs');
const path = require('path');

// Load the list of bad words from the file into an array
const badWordsFile = path.join(__dirname, 'offensive-words.txt');
const badWordsList = fs.readFileSync(badWordsFile, 'utf8').split('\n');

const post_index = (req, res) => {
  Post.find()
    .then(posts => {
      res.render('index', { posts, title: 'All posts' });
    })
    .catch(err => {
      console.log(err);
      res.status(500).send('Internal Server Error');
    });
};

const post_create_post = (req, res) => {
  // Check if any of the words in title or body match the bad words
  const title = req.body.title;
  const body = req.body.body;

  if (containsBadWords(title) || containsBadWords(body)) {
    // Handle the case where bad words are found (e.g., reject the post)
    console.log('Bad words found in title or body');
    res.redirect('/error'); // Redirect to an error page or handle appropriately
  } else {
    // If no bad words are found, proceed to save the post
    const post = new Post(req.body);
    console.log(post);
    post.save()
      .then(result => {
        res.redirect('/');
      })
      .catch(err => {
        console.log(err);
      });
  }
};

function containsBadWords(text) {
  const words = text.toLowerCase().split(/\s+/);
  for (const word of words) {
    if (badWordsList.includes(word)) {
      return true;
    }
  }
  return false;
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
  post_create_post,
  post_index
}