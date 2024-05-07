const router = require('express').Router();
const { auth } = require('../middlewares/auth');
const { createUser, login } = require('../controllers/users');
const NotFoundError = require('../errors/NotFoundError');
const { errorMessages } = require('../utils/constants');

router.post('/signup', createUser);
router.post('/signin', login);
router.post('/signout', auth, (req, res, next) => {
  try {
    res.clearCookie('jwt', {
      maxAge: 3600000 * 24 * 7,
      httpOnly: true,
      secure: true,
      sameSite: true,
    });
  } catch (err) {
    return next(err);
  }
});

router.use('/users', auth, require('./users'));
router.use('/products/:productId/feedbacks', require('./feedbacks'));
router.use('/products', require('./products'));
router.use('/orders', require('./orders'));
router.use('/repair', require('./repairs'));

router.use('*', (req, res, next) => {
  next(new NotFoundError(errorMessages.pageNotFound));
});

module.exports = router;
