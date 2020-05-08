const Router = require('express-promise-router');

const {
  getAllSlides,
  createFooterSlide,
  postCreateFooterSlide,
  updateFooterSlide,
  postUpdateFooterSlide,
  deleteFooterSlide,
} = require('../models/slidesFooter');

const router = new Router();

router.get('/create', createFooterSlide);
router.post('/create', postCreateFooterSlide);
router.get('/update/:id', updateFooterSlide);
router.post('/update/:id', postUpdateFooterSlide);
router.post('/delete/:id', deleteFooterSlide);
router.get('/', getAllSlides);

module.exports = router;
