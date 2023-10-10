const Post = require('../models/post');

var Filter = require('bad-words'),
    filter = new Filter();

filter.addWords('fuc', 'fuk', 'fU(k', '9/11');

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

  const post = new Post({
    id: req.body.id,
    user: req.body.user,
    title: filter.clean(req.body.title),
    body: filter.clean(req.body.body)
  });
  console.log(post);

  post.save()
    .then(result => {
      res.redirect('/');
    })
    .catch(err => {
      console.log(err);
    });

};

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