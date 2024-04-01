const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { HTTP_STATUS_CREATED } = require('http2').constants;

const Admin = require('../models/admin');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');
const ForbiddenError = require('../errors/ForbiddenError');
const ServerError = require('../errors/ServerError');
const { errorMessages } = require('../utils/constants');

const {
  serverErr,
  createForbiddenErr,
  conflictErr,
} = errorMessages;

const { JWT_CODE } = process.env;

module.exports.createAdmin = (req, res, next) => {
  const { login, password, adminId } = req.body;

  Admin.findById(adminId)
    .then((admin) => {
      if (!admin) {
        return next(new ForbiddenError(createForbiddenErr));
      }

      return bcrypt.hash(password, 12);
    })
    .then((hash) => Admin.create({ login, password: hash }))
    .then(() => res.status(HTTP_STATUS_CREATED).send({ login }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError(/*  */));
      }
      if (err.code === 11000) {
        return next(new ConflictError(conflictErr));
      }
      return next(new ServerError(serverErr));
    });
};
