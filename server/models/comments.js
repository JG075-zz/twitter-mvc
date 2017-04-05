// load the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentsSchema = mongoose.Schema({
  created: {
    type: Date,
    default: Date.now
  },
  title: {
    type: String,
    default: '',
    trim: true,
    require: 'Title cannot be blank'
  },
  content: {
    type: String,
    default: '',
    trim: true
  },
  user: {
    type: Schema.ObjectID,
    ref: 'User'
  }
});

module.exports = mongoose.model('Comments', commentSchema);
