const express = require('express');

const router = express.Router();

router.get('/', async (req, res, next) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        next(err);
      }
      res.redirect('/login');
    });
  }
});

module.exports = router;
