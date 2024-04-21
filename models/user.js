const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const isEmail = require('validator/lib/isEmail');
const NotAuthorizedError = require('../errors/NotAuthorizedError');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    validate: {
      validator: (v) => isEmail(v),
      message: 'Неправильный формат почты',
    },
  },
  phone: {
    type: String,
    length: 10,
  },
  password: {
    type: String,
    minlength: 5,
    select: false,
  },
  isGuest: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Гость',
  },
  lastName: {
    type: String,
    minlength: 2,
    maxlength: 60,
  },
  favorites: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'product',
    },
  ],
  cart: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product',
      },
      category: {
        type: String,
        required: true,
      },
      image: {
        type: String,
        required: true,
      },
      productName: {
        type: String,
        required: true,
      },
      productCost: {
        type: Number,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
  /* chats: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'chat',
    },
  ], */
}, { versionKey: false });

userSchema.statics.findByEmail = function (email, password) {
  return this.findOne({ email }).select('+password')
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

userSchema.statics.findByPhone = function (phone, password) {
  return this.findOne({ phone }).select('+password')
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
