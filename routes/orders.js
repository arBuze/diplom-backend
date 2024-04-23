const router = require('express').Router();
const {
  getAllOrders,
  getUserOrders,
  createOrder,
  changeOrderStatus,
  deleteOrder,
} = require('../controllers/orders');
const { auth } = require('../middlewares/auth');
const { adminAuth, checkAdmin } = require('../middlewares/adminAuth');

router.get('/', adminAuth, checkAdmin, getAllOrders);
router.get('/me', auth, getUserOrders);

router.post('/', auth, createOrder);

router.patch('/:orderId', changeOrderStatus);

router.delete('/:orderId', deleteOrder);

module.exports = router;
