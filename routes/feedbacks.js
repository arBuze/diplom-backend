const router = require('express').Router();
const {
  getFeedback,
  createFeedback,
  deleteFeedback,
  likeFeedback,
  dislikeFeedback,
} = require('../controllers/feedbacks');
const { auth } = require('../middlewares/auth');
const { adminAuth, checkAdmin } = require('../middlewares/adminAuth');

router.get('/', getFeedback);
router.post('/', auth, createFeedback);
router.delete('/:feedbackId', adminAuth, checkAdmin, deleteFeedback);

router.patch('/:feedbackId/likes', auth, likeFeedback);
router.delete('/:feedbackId/likes', auth, dislikeFeedback);

module.exports = router;
