const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const isEmail = require('validator/lib/isEmail');
const NotAuthorizedError = require('../errors/NotAuthorizedError');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    validate: {
      validator: (v) => isEmail(v),
      message: 'Неправильный формат почты',
    },
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
  phone: {
    type: String,
    length: 10,
    unique: true,
  },
  favorites: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'product',
    },
  ],
  cart: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'product',
    },
  ],
  orders: [
    {
      createdAt: {
        type: Date,
        default: Date.now,
      },
      products: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'product',
        },
      ],
      status: {
        type: String,
      },
    },
  ],
  chats: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'chat',
    },
  ],
}, { versionKey: false });

userSchema.statics.findByCredentials = function (login, password) {
  return this.findOne({ login }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new NotAuthorizedError('Неправильные логин или пароль'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new NotAuthorizedError('Неправильные логин или пароль'));
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
