const { Router } = require('express');
const messageController = require('../controllers/messageController');
const { requireAuth, checkUser } = require('../middleware/authMiddleware');

const router = Router()

// router.get('/create', postController.post_create_get);
// router.get('/', postController.post_index);
router.get('*', checkUser)
router.post('/messages', messageController.message_create_message);
router.get('/messages', requireAuth, messageController.message_index);
// router.get('/:id', postController.post_details);
// router.delete('/:id', postController.post_delete);

module.exports = router;