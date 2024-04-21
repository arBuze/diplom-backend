const mongoose = require('mongoose');

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
  status: {
    required: true,
    enum: ['в сборке', 'готов к выдаче', 'выполнен'],
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
});

module.exports = mongoose.model('order', orderSchema);
