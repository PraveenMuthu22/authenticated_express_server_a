const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');

const authRouter = require('./routes/authRoutes');
const articleRoutes = require('./routes/articleRoutes');

const User = require('./models/User');

const CONNECTION_STRING = 'mongodb+srv://test:2012Test@authenticated-express-server-hzmbt.mongodb.net/test?retryWrites=true';

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/auth', authRouter.router);
app.use('/articles', articleRoutes);

app.get('/test', (req, res)=> {
	 res.send('Hello World');
});

app.get('/getUsers', authRouter.authenticate, async (req, res) => {
  const users = await User.find({});
  res.status(200).send(users);
});


mongoose.connect(
  CONNECTION_STRING,
  { useNewUrlParser: true },
  (error) => {
    if (error) {
      console.log(error);
		} else {
			console.log('Connected to database');
		}
  }
);

module.exports = app;
