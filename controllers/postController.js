const Post = require('../models/post');

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
  const post = new Post(req.body);
  console.log(post)
  post.save()
    .then(result => {
      res.redirect('/');
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
  post_create_post,
  post_index
}