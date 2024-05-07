const router = require('express').Router();
const {
  getCurrentUser,
  updateUserData,
  changePassword,
  addToFavorite,
  deleteFromFavorite,
  addToCart,
  changeQuantity,
  deleteFromCart,
  clearCart,
  deleteUser,
} = require('../controllers/users');

router.get('/me', getCurrentUser);
router.patch('/me', updateUserData);
router.patch('/me/pas', changePassword);
router.delete('/me', deleteUser);

router.patch('/me/favorite', addToFavorite);
router.delete('/me/favorite/:productId', deleteFromFavorite);

router.patch('/me/cart', addToCart);
router.patch('/me/cart/:productId', changeQuantity);
router.delete('/me/cart/:productId', deleteFromCart);
router.delete('/me/cart', clearCart);

module.exports = router;
