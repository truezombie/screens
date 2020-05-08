const Router = require('express-promise-router');

const {
  getAllSlides,
  createBodySlide,
  postCreateBodySlide,
  updateBodySlide,
  postUpdateBodySlide,
  deleteBodySlide,
} = require('../models/slidesBody');

const router = new Router();

router.get('/create', createBodySlide);
router.post('/create', postCreateBodySlide);
router.get('/update/:id', updateBodySlide);
router.post('/update/:id', postUpdateBodySlide);
router.post('/delete/:id', deleteBodySlide);
router.get('/', getAllSlides);

module.exports = router;
