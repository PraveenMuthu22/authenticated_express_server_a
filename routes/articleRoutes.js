const express = require('express');
const authRoutes = require('./authRoutes');
const Article = require('../models/Article');

const router = express.Router();

router.post('/post', authRoutes.authenticate, (req, res) => {
  const { body } = req;
  body.author = req.userId;
  const article = new Article(body);

  article.save((error, result) => {
    if (error) {
      console.log(error);
    } else {
      console.log(result);
      res.status(200).send('Article Posted');
    }
  });
});

router.get('/get', authRoutes.authenticate, async (req, res) => {
	console.log('id', req.userId);

	const articles = await Article.find({ author: req.userId });

  if (!articles || articles.length === 0) {
    return res.status(404).send({ error: 'No articles by that user' });
	}
	return res.status(200).send(articles);
});

module.exports = router;
