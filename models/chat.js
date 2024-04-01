const mongoose = require('mongoose');
const { urlRegex } = require('../utils/constants');

const chatSchema = new mongoose.Schema({
  messages: [
    {
      owner: {
        name: {
          type: String,
        },
        lastName: {
          type: String,
        },
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
        required: true,
      },
      text: {
        type: String,
        required: true,
      },
      images: [
        {
          type: String,
          validate: {
            validator: (v) => urlRegex.test(v),
            message: 'Неверный формат ссылки',
          },
        },
      ],
    },
  ],
}, { versionKey: false });

module.exports = mongoose.model('chat', chatSchema);
