const mongoose = require('mongoose');

const repairSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  contact: {
    type: String,
    required: true,
  },
  /* owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  }, */
  /* isGuest: {
    type: Boolean,
    required: true,
  }, */
  createdAt: {
    type: Date,
    default: Date.now,
  },
  files: [
    {
      type: String,
    },
  ],
}, { versionKey: false });

module.exports = mongoose.model('repair', repairSchema);
