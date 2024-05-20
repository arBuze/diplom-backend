const { HTTP_STATUS_CREATED } = require('http2').constants;

const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
/* const ForbiddenError = require('../errors/ForbiddenError'); */
const ServerError = require('../errors/ServerError');
const Order = require('../models/order');
const { errorMessages } = require('../utils/constants');

const { serverErr } = errorMessages;

module.exports.createOrder = (req, res, next) => {
  const {
    isGuest,
    status,
    products,
    contacts,
    payment,
  } = req.body;

  console.log(isGuest,
    status,
    products,
    contacts,
    payment);

  Order.create({
    isGuest,
    status,
    products,
    contacts,
    owner: req.user._id,
    payment,
  })
    .then((order) => res.status(HTTP_STATUS_CREATED).send(order))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('no'));
      }
      if (err.name === 'CastError') {
        return next(new BadRequestError('Некорректный _id пользователя'));
      }
      return next(new ServerError(serverErr));
    });
};

module.exports.getAllOrders = (req, res, next) => {
  Order.find({})
    .then((orders) => res.send(orders))
    .catch(() => next(new ServerError(serverErr)));
};

module.exports.getUserOrders = (req, res, next) => {
  Order.find({ owner: req.user._id })
    .then((orders) => res.send(orders))
    .catch(() => next(new ServerError(serverErr)));
};

module.exports.changeOrderStatus = (req, res, next) => {
  const { status } = req.body;

  Order.findByIdAndUpdate(
    req.params.orderId,
    {
      $set: {
        status,
      },
    },
    { new: true },
  )
    .then((order) => {
      if (!order) {
        return next(new NotFoundError('not found'));
      }
      return res.send(order);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Переданы некорректные данные'));
      }
      return next(new ServerError(serverErr));
    });
};

module.exports.deleteOrder = (req, res, next) => {
  Order.findById(req.params.orderId)
    .then((order) => {
      if (!order) {
        return next(new NotFoundError('not found'));
      }
      /* if (!order.owner.equals(req.user._id)) {
        return next(new ForbiddenError('mustnt'));
      } */
      return Order.deleteOne(order);
    })
    .then(() => res.send({ message: 'Заказ удален' }))
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('bad id'));
      }
      return next(new ServerError(serverErr));
    });
};
