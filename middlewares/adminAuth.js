const jwt = require('jsonwebtoken');
const NotAuthorizedError = require('../errors/NotAuthorizedError');

const { JWT_CODE } = process.env;

module.exports.adminAuth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new NotAuthorizedError('Необходима авторизация'));
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, JWT_CODE);
  } catch (err) {
    return next(new NotAuthorizedError('Необходима авторизация'));
  }

  req.admin = payload;

  return next();
};
