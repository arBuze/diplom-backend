const router = require('express').Router();
const { auth } = require('../middlewares/auth');
const { createUser, login } = require('../controllers/users');
const NotFoundError = require('../errors/NotFoundError');
const { errorMessages } = require('../utils/constants');

router.post('/signup', createUser);
router.post('/signin', login);

router.use('/users', auth, require('./users'));
router.use('/products', require('./products'));
router.use('/feedbacks', require('./feedbacks'));

router.use('*', (req, res, next) => {
  next(new NotFoundError(errorMessages.pageNotFound));
});

module.exports = router;
