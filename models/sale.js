const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  startsAt: {
    type: String,
    required: true,
  },
  endsAt: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: 'default-img.jpg',
  },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product',
      },
    },
  ],
}, { versionKey: false });

module.exports = mongoose.model('sale', saleSchema);
