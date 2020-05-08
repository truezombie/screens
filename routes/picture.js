const Router = require('express-promise-router');

const {
  getAllPictures,
  pictureUpdate,
  postUploadPicture,
  postDeletePicture,
  postPictureUpdate,
} = require('../models/picture');

const router = new Router();

router.get('/', getAllPictures);
router.post('/upload', postUploadPicture);
router.post('/delete/:name', postDeletePicture);
router.get('/update/:id', pictureUpdate);
router.post('/update/:id', postPictureUpdate);

module.exports = router;
