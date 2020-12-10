const passport = require('passport');
const User = require('../models/User');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv');
dotenv.config({ path: './.env'})

// Create local strategy
const localOptions = {
  usernameField: 'email'
}
const localLogin = new LocalStrategy(localOptions, async function(email, password, done) {
  // Verify this email and password, call done with the user
  // if it is the correct email and assword
  // otherwise, call done with false
  try {
    const user = await User.findOne({email: email});
    if (!user) return done(null, false);
    user.comparePassword(password, function(err, isMatch) {
      if (err) {
        return done(err);
      }
      if (!isMatch) {
        return done(null, false);
      }
      return done(null, user);
    })
  } catch (err) {
    return done(err);
  }
})

// Setup options for JWT Strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: process.env.SECRET
};

// Create JWT strategy
const jwtLogin = new JwtStrategy(jwtOptions, async function(payload, done) {
  // See if the user ID in the payload exists in our database
  // If it does, call 'done' with that user
  // otherwise, call done without a user object
  try {
    const authUser = await User.findById(payload.sub);
    if (authUser) {
      done(null, authUser);
      console.log(authUser)
    } else {
      done(null, false);
    }
  } catch(err) {
    return done(err, false);
  }
})

// Tell passport to use this strategy
passport.use(jwtLogin);
passport.use(localLogin);