const path = require('path');
const multer = require('multer');
const fs = require('fs');
const db = require('../db');
const errorResult = require('../services/errorsHandling');
const validation = require('../services/validation');

// Set The Storage Engine
const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

// Check File Type
const checkFileType = (file, cb) => {
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif|svg/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  }

  return cb('Error: Images Only!');
};

// Init Upload
const upload = multer({
  storage,
  limits: { fileSize: 3000000 },
  fileFilter(req, file, cb) {
    checkFileType(file, cb);
  },
}).single('picture');

// ROUTES

const getAllPictures = async (req, res) => {
  try {
    const { rows: pictures } = await db.query(`SELECT * FROM public.pictures`);

    res.render('adminPicture', {
      pageName: 'Управление картинками',
      submitLink: '/pictures/upload',
      baseUrl: req.baseUrl,
      pictures,
      picturesPath: 'uploads/',
    });
  } catch (error) {
    errorResult(res, error);
  }
};

const setNewImageInDb = async (req, res) => {
  try {
    await db.query(
      `INSERT INTO public.pictures(name, real_name) VALUES($1, $2)`,
      [req.file.filename, req.file.originalname]
    );

    res.redirect('/pictures');
  } catch (error) {
    errorResult(res, error);
  }
};

const postUploadPicture = (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      // TODO: error
    } else if (req.file === undefined) {
      // TODO: error
    } else {
      setNewImageInDb(req, res);
    }
  });
};

const postDeletePicture = async (req, res) => {
  try {
    fs.unlinkSync(path.resolve(`./public/uploads/${req.params.name}`));

    await db.query(`DELETE FROM public.pictures WHERE name=$1`, [
      req.params.name,
    ]);

    res.redirect('/pictures');
  } catch (error) {
    errorResult(res, error);
  }
};

const pictureUpdate = async (req, res) => {
  try {
    const {
      rows: pictures,
    } = await db.query(`SELECT * FROM public.pictures WHERE id=$1`, [
      req.params.id,
    ]);

    res.render('adminManagePicture', {
      pageName: `Редактирование картинки ${pictures[0].real_name}`,
      baseUrl: req.baseUrl,
      name: pictures[0].real_name,
      backLink: '/pictures',
      submitLink: `/pictures/update/${pictures[0].id}`,
    });
  } catch (error) {
    errorResult(res, error);
  }
};

const postPictureUpdate = async (req, res) => {
  try {
    const [name] = validation.str([req.body.name]);

    await db.query(
      `
      UPDATE public.pictures
      SET
        real_name=$1
      WHERE id=$2`,
      [name, req.params.id]
    );

    res.redirect('/pictures');
  } catch (error) {
    errorResult(res, error);
  }
};

module.exports = {
  getAllPictures,
  pictureUpdate,
  postUploadPicture,
  postDeletePicture,
  postPictureUpdate,
};
