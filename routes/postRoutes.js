const express = require('express');
const postController = require('../controllers/postController');

const router = express.Router();

// router.get('/create', postController.post_create_get);
// router.get('/', postController.post_index);
router.post('/', postController.post_create_post);
router.get('/', postController.post_index);
// router.get('/:id', postController.post_details);
// router.delete('/:id', postController.post_delete);

module.exports = router;