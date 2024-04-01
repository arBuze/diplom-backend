const router = require('express').Router();
const {
  getFeedback,
  createFeedback,
  likeFeedback,
  dislikeFeedback,
} = require('../controllers/feedbacks');

router.get('/:productId', getFeedback);
router.post('/:productId', createFeedback);

router.put('/:productId/likes', likeFeedback);
router.delete('/:productId/likes', dislikeFeedback);

module.exports = router;
