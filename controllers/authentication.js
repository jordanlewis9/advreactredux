const jwt = require('jsonwebtoken');
const User = require('../models/User');

function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.sign({ sub: user.id, iat: timestamp }, process.env.SECRET, {
      expiresIn: '30000ms'
  })
};

exports.signin = function(req, res, next) {
  // User has already had their email and password auth'd
  // We just need to give them a token
  console.log(tokenForUser(req.user))
  res.send({ token: tokenForUser(req.user)});
}

exports.signup = async function(req, res, next) {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return res.status(422).send({ error: "You must provide an email and a password!" })
  }
  // See if a user with the given email exists
  try {
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(422).send({
        error: 'Email already in use'
      })
    } 
  } catch(err) {
    return next(err)
  }
  // If a user with email does exist, return an error

  // If a user with email does NOT exist, create and save user record
  const user = new User({
    email: email,
    password: password
  });
  try {
    await user.save();
    res.json({ token: tokenForUser(user) })
  } catch(err) {
    return next(err)
  }
  // Respond to requrest indicating the user was created
}