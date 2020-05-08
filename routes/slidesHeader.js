const Router = require('express-promise-router');

const {
  getAllSlides,
  createHeaderSlide,
  postCreateHeaderSlide,
  updateHeaderSlide,
  postUpdateHeaderSlide,
  deleteHeaderSlide,
} = require('../models/slidesHeader');

const router = new Router();

router.get('/create', createHeaderSlide);
router.post('/create', postCreateHeaderSlide);
router.get('/update/:id', updateHeaderSlide);
router.post('/update/:id', postUpdateHeaderSlide);
router.post('/delete/:id', deleteHeaderSlide);
router.get('/', getAllSlides);

module.exports = router;
