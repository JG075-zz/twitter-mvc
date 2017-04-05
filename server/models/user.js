// Import Mongoose and password Encrypt
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

// define the schema for the User model
var userSchema = new mongoose.Schema({
  // using local for Local Strategy Passport
  local: {
    name: String,
    email: String,
    password: String
  }
});

// Encrypt Password
userSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// Verify if password is valid
userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.local.password);
};

// create the model for the users and expose it to our app
module.exports = mongoose.model('User', userSchema);
