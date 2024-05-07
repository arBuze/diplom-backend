const mongoose = require('mongoose');
const isEmail = require('validator/lib/isEmail');

const orderSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  isGuest: {
    type: Boolean,
    required: true,
  },
  contacts: {
    phone: {
      type: String,
      required: true,
      length: 10,
    },
    email: {
      type: String,
      validate: {
        validator: (v) => isEmail(v),
        message: 'Неправильный формат почты',
      },
    },
  },
  status: {
    required: true,
    type: String,
    enum: ['ждет оплаты', 'оплачен', 'в сборке', 'готов к выдаче', 'выполнен', 'отменен'],
    description: 'Не совпадает с возможными значениями',
  },
  products: [
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
}, { versionKey: false });

module.exports = mongoose.model('order', orderSchema);
