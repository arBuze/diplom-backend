const router = require('express').Router();
const {
  getCurrentUser,
  updateUserData,
  addToFavorite,
  deleteFromFavorite,
  addToCart,
  deleteFromCart,
  clearCart,
  createOrder,
} = require('../controllers/users');

router.get('/me', getCurrentUser);
router.patch('/me', updateUserData);

router.put('/favorite', addToFavorite);
router.delete('/favorite/:productId', deleteFromFavorite);

router.put('/cart', addToCart);
router.delete('/cart/:productId', deleteFromCart);
router.delete('/cart', clearCart);

router.put('/order', createOrder);

module.exports = router;
