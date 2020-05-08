const Router = require('express-promise-router');

const {
  getAllCurrencies,
  createCurrency,
  updateCurrency,
  postCreateCurrency,
  postUpdateCurrency,
  postDeleteCurrency,
} = require('../models/currency');

const router = new Router();

router.get('/create', createCurrency);
router.post('/create', postCreateCurrency);
router.get('/update/:id', updateCurrency);
router.post('/update/:id', postUpdateCurrency);
router.post('/delete/:id', postDeleteCurrency);
router.get('/', getAllCurrencies);

module.exports = router;
