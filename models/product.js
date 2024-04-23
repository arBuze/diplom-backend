const mongoose = require('mongoose');
/* const { urlRegex } = require('../utils/constants'); */

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
  },
  category: {
    type: String,
    required: true,
  },
  images: [
    {
      type: String,
      /* validate: {
        validator: (v) => urlRegex.test(v),
        message: 'Неверный формат ссылки',
      }, */
    },
  ],
  characteristics: [
    {
      name: {
        type: String,
        required: true,
      },
      value: {
        type: String,
        required: true,
      },
    },
  ],
  price: {
    type: Number,
    required: true,
  },
  sale: {
    type: Number,
  },
  descripton: {
    type: String,
    minlength: 2,
  },
  rating: {
    type: Number,
  },
}, { versionKey: false });

module.exports = mongoose.model('product', productSchema);
