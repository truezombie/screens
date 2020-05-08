const Router = require('express-promise-router');

const {
  getAllScreens,
  createScreen,
  updateScreen,
  postDeleteScreen,
  postCreateScreen,
  postUpdateScreen,
} = require('../models/adminScreen');

const {
  createScreenHeaderSlide,
  updateScreenHeaderSlide,
  postDeleteScreenHeaderSlide,
  postCreateScreenHeaderSlide,
  postUpdateScreenHeaderSlide,
} = require('../models/adminScreenSlideHeader');

const {
  createScreenBodySlide,
  updateScreenBodySlide,
  postDeleteScreenBodySlide,
  postUpdateScreenBodySlide,
  postCreateScreenBodySlide,
} = require('../models/adminScreenSlideBody');

const {
  createScreenFooterSlide,
  updateScreenFooterSlide,
  postDeleteScreenFooterSlide,
  postCreateScreenFooterSlide,
  postUpdateScreenFooterSlide,
} = require('../models/adminScreenSlideFooter');

const router = new Router();

router.get('/', getAllScreens);
router.get('/create', createScreen);
router.get('/update/:id', updateScreen);
router.post('/delete/:id', postDeleteScreen);
router.post('/update/:id', postUpdateScreen);
router.post('/create', postCreateScreen);

// HEADER SLIDES
router.get('/create-header-screen/:id', createScreenHeaderSlide);
router.get('/update-header-screen/:id', updateScreenHeaderSlide);
router.post('/delete-header-screen/:id', postDeleteScreenHeaderSlide);
router.post('/update-header-screen/:id', postUpdateScreenHeaderSlide);
router.post('/create-header-screen/:id', postCreateScreenHeaderSlide);

// BODY SLIDES
router.get('/create-body-screen/:id', createScreenBodySlide);
router.get('/update-body-screen/:id', updateScreenBodySlide);
router.post('/delete-body-screen/:id', postDeleteScreenBodySlide);
router.post('/update-body-screen/:id', postUpdateScreenBodySlide);
router.post('/create-body-screen/:id', postCreateScreenBodySlide);

// FOOTER SLIDES
router.get('/create-footer-screen/:id', createScreenFooterSlide);
router.get('/update-footer-screen/:id', updateScreenFooterSlide);
router.post('/delete-footer-screen/:id', postDeleteScreenFooterSlide);
router.post('/update-footer-screen/:id', postUpdateScreenFooterSlide);
router.post('/create-footer-screen/:id', postCreateScreenFooterSlide);

module.exports = router;
