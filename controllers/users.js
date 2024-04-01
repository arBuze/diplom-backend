const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { HTTP_STATUS_CREATED } = require('http2').constants;

const User = require('../models/user');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');
const ServerError = require('../errors/ServerError');
const { errorMessages } = require('../utils/constants');

const {
  serverErr,
  userNotFound,
  badRequestId,
  conflictErr,
  badRequestUpdateData,
  badRequestCreateUser,
} = errorMessages;

const { JWT_SECRET } = process.env;

/* создание пользователя */
module.exports.createUser = (req, res, next) => {
  const { email, password, phone } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => {
      if (email) {
        return User.create({ email, password: hash });
      }
      if (phone) {
        return User.create({ phone, password: hash });
      }
      return next(new BadRequestError(badRequestCreateUser));
    })
    .then(() => {
      if (email) {
        return res.status(HTTP_STATUS_CREATED).send({ email });
      }
      return res.status(HTTP_STATUS_CREATED).send({ phone });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError(badRequestCreateUser));
      }
      if (err.code === 11000) {
        return next(new ConflictError(conflictErr));
      }
      return next(new ServerError(serverErr));
    });
};

/* получение данных пользователя */
module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        return next(new NotFoundError(userNotFound));
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError(badRequestId));
      }
      return next(new ServerError(serverErr));
    });
};

/* изменение данных пользователя */
module.exports.updateUserData = (req, res, next) => {
  const {
    email,
    name,
    lastName,
    phone,
  } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        email,
        name,
        lastName,
        phone,
      },
    },
    {
      returnDocument: 'after',
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        return next(new NotFoundError(userNotFound));
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.code === 11000) {
        return next(new ConflictError(conflictErr));
      }
      if (err.name === 'ValidationError') {
        return next(new BadRequestError(badRequestUpdateData));
      }
      return next(new ServerError(serverErr));
    });
};

/* добавление в избранное */
module.exports.addToFavorite = (req, res, next) => {
  User.findByIdAndUpdate(
    req.user._id,
    { $addToSet: { favorites: req.params.productId } },
    { new: true },
  )
    .then((user) => {
      if (!user) {
        return next(new NotFoundError(userNotFound));
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError(badRequestId));
      }
      return next(new ServerError(serverErr));
    });
};

/* удаление из избранного */
module.exports.deleteFromFavorite = (req, res, next) => {
  User.findByIdAndUpdate(
    req.user._id,
    { $pull: { favorites: req.params.productId } },
    { new: true },
  )
    .then((user) => {
      if (!user) {
        return next(new NotFoundError(userNotFound));
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError(badRequestId));
      }
      return next(new ServerError(serverErr));
    });
};

/* добавление в корзину */
module.exports.addToCart = (req, res, next) => {
  User.findByIdAndUpdate(
    req.user._id,
    { $addToSet: { cart: req.params.productId } },
    { new: true },
  )
    .then((user) => {
      if (!user) {
        return next(new NotFoundError(userNotFound));
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError(badRequestId));
      }
      return next(new ServerError(serverErr));
    });
};

/* удаление из корзины */
module.exports.deleteFromCart = (req, res, next) => {
  User.findByIdAndUpdate(
    req.user._id,
    { $pull: { cart: req.params.productId } },
    { new: true },
  )
    .then((user) => {
      if (!user) {
        return next(new NotFoundError(userNotFound));
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError(badRequestId));
      }
      return next(new ServerError(serverErr));
    });
};

/* очистка корзины */
module.exports.clearCart = (req, res, next) => {
  User.findByIdAndUpdate(
    req.user._id,
    { $set: { cart: null } },
    { new: true },
  )
    .then((user) => {
      if (!user) {
        return next(new NotFoundError(userNotFound));
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError(badRequestId));
      }
      return next(new ServerError(serverErr));
    });
};

/* создание заказа */
module.exports.createOrder = (req, res, next) => {
  const { products, status } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { $addToSet: { orders: { products, status } } },
    { new: true },
  )
    .then((user) => {
      if (!user) {
        return next(new NotFoundError('Передан несуществующий _id пользователя'));
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Некорректный _id пользователя'));
      }
      return next(new ServerError(serverErr));
    });
};

/* вход */
module.exports.login = (req, res, next) => {
  const { email, password, phone } = req.body;

  if (email) {
    return User.findByCredentials(email, password)
      .then((user) => {
        const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });

        res.send({ token });
      })
      .catch(next);
  }
  return User.findByCredentials(phone, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });

      res.send({ token });
    })
    .catch(next);
};
