const express = require('express');
const jwt = require('jwt-simple');

const User = require('../models/User');
const secret = 'thisIsMySecret123';

const router = express.Router();

router.post('/register', async (req, res) => {
  const user = new User(req.body);

  const userExists = await User.findOne({ email: req.body.email });
  if (userExists) {
    return res.status(400).send({ error: 'User already exists' });
  }

  user.save((error, newUser) => {
    if (error) {
      return res.status(500).send('Error Saving user');
    }
    console.log(newUser);
    return res.sendStatus(200);
  });
});

router.post('/login', async (req, res) => {
  const user = await User.findOne(
    { email: req.body.email, password: req.body.password },
    '-password'
  );

  if (user) {
    const token = jwt.encode(user._id, secret);
    return res.send(token);
  }
  // If user doesn't exist
  return res.status(401).send('Email or password entered is invalid');
});

const authenticate = (req, res, next) => {
  if (!req.header('authorization')) {
    return res.status(401).send({ error: 'Token is missing token' });
  }
  const token = req.header('authorization').split(' ')[1];
  const userId = jwt.decode(token, secret);

  if (!userId) {
    return res.status('401').send({ error: 'Token is invalid' });
  }
  req.userId = userId;
  next();
};

const auth = {
  router,
  authenticate
};

module.exports = auth;
