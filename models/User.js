const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

// Define our model
const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    lowercase: true,
    required: [true, "An email is required to create an account."]
  },
  password: {
    type: String,
    required: [true, "A password must be associated with this account."]
  }
});

userSchema.pre('save', function(next) {
  const user = this;
  bcrypt.genSalt(10, function(err, salt) {
    if (err) { return next(err)};
    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) { return next(err); }
      user.password = hash;
      next();
    })
  })
});

userSchema.methods.comparePassword = function(candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) {
      return callback(err);
    }
    callback(null, isMatch);
  })
}

// Create the model class
const User = mongoose.model('user', userSchema)

//Export the model
module.exports = User;