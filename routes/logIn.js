const express = require('express');

const router = express.Router();

router.get('/', async (req, res) => {
  res.render('logIn');
});

module.exports = router;
