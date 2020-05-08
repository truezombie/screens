const Router = require('express-promise-router');

const {
  getAllBrands,
  createBrand,
  updateBrand,
  postCreateBrand,
  postUpdateBrand,
  postDeleteBrand,
} = require('../models/brand');

const router = new Router();

router.get('/', getAllBrands);
router.get('/create', createBrand);
router.post('/create', postCreateBrand);
router.get('/update/:id', updateBrand);
router.post('/update/:id', postUpdateBrand);
router.post('/delete/:id', postDeleteBrand);

module.exports = router;
