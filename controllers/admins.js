const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { HTTP_STATUS_CREATED } = require('http2').constants;

const Admin = require('../models/admin');
const BadRequestError = require('../errors/BadRequestError');
/* const NotFoundError = require('../errors/NotFoundError'); */
const ConflictError = require('../errors/ConflictError');
/* const ForbiddenError = require('../errors/ForbiddenError'); */
const ServerError = require('../errors/ServerError');
const { errorMessages } = require('../utils/constants');
const NotFoundError = require('../errors/NotFoundError');
const path = require('path');

const {
  serverErr,
  /* createForbiddenErr, */
  conflictErr,
  badRequestId,
} = errorMessages;

const { JWT_CODE } = process.env;

module.exports.createAdmin = (req, res, next) => {
  const {
    login,
    password,
    name,
    lastName,
  } = req.body;

  bcrypt.hash(password, 12)
    .then((hash) => Admin.create({
      login,
      password: hash,
      name,
      lastName,
    }))
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

module.exports.getAdminData = (req, res, next) => {
  Admin.findById(req.admin._id)
    .then((admin) => {
      if (!admin) {
        return next(new NotFoundError('norfound'));
      }
      return res.send(admin);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError(badRequestId));
      }
      return next(new ServerError(serverErr));
    });
};

module.exports.adminLogin = (req, res, next) => {
  const { login, password } = req.body;

  Admin.findByCredentials(login, password)
    .then((admin) => {
      const token = jwt.sign({ _id: admin._id }, JWT_CODE, { expiresIn: '3d' });

      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 3,
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
      });
      res.send({ admin });
    })
    .catch(next);
};
