const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const NotAuthorizedError = require('../errors/NotAuthorizedError');

const adminSchema = new mongoose.Schema({
  login: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    select: false,
  },
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
  },
  lastName: {
    type: String,
    minlength: 2,
    maxlength: 60,
  },
  /* phone: {
    type: String,
    length: 10,
  }, */
}, { versionKey: false });

adminSchema.statics.findByCredentials = function (login, password) {
  return this.findOne({ login }).select('+password')
    .then((admin) => {
      if (!admin) {
        return Promise.reject(new NotAuthorizedError('Неправильные логин или пароль'));
      }

      return bcrypt.compare(password, admin.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new NotAuthorizedError('Неправильные логин или пароль'));
          }
          return admin;
        });
    });
};

module.exports = mongoose.model('admin', adminSchema);
