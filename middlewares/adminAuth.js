const jwt = require('jsonwebtoken');
const NotAuthorizedError = require('../errors/NotAuthorizedError');
const ForbiddenError = require('../errors/ForbiddenError');
const ServerError = require('../errors/ServerError');
const Admin = require('../models/admin');
const { errorMessages } = require('../utils/constants');

const { JWT_CODE } = process.env;

module.exports.adminAuth = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return next(new NotAuthorizedError('Необходима авторизация'));
  }

  let payload;

  try {
    payload = jwt.verify(token, JWT_CODE);
  } catch (err) {
    return next(new NotAuthorizedError('Необходима авторизация'));
  }

  req.admin = payload;

  return next();
};

module.exports.checkAdmin = (req, res, next) => {
  Admin.findById(req.admin._id)
    .then((admin) => {
      if (!admin) {
        return next(new ForbiddenError('Not admin'));
      }
      return next();
    })
    .catch(() => next(new ServerError(errorMessages.serverErr)));
};
