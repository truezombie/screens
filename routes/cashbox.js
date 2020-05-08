const Router = require('express-promise-router');

const {
  getAllCashboxes,
  createCashbox,
  updateCashbox,
  postCashbox,
  deleteCashbox,
  postUpdateCashbox,
} = require('../models/cashbox');

const router = new Router();

router.get('/create', createCashbox);
router.post('/create', postCashbox);
router.post('/delete/:id', deleteCashbox);
router.get('/update/:id', updateCashbox);
router.post('/update/:id', postUpdateCashbox);
router.get('/', getAllCashboxes);

module.exports = router;
