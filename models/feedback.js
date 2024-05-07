const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  owner: {
    /* type: mongoose.Schema.Types.ObjectId,
    ref: 'user', */
    type: String,
    required: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'product',
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  likes: [
    {
      owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
      },
      value: {
        type: Number,
        enum: [1, -1],
        description: 'Значениями могут быть только 1 и -1',
      },
    },
  ],
}, { versionKey: false });

module.exports = mongoose.model('feedback', feedbackSchema);
