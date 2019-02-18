const mongoose = require('mongoose');

module.exports = mongoose.model('Article', {
  title: String,
  content: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

