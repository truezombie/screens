const db = require('../db');
const errorResult = require('../services/errorsHandling');
const validation = require('../services/validation');

const getAllSlides = async (req, res) => {
  try {
    const { rows: slides } = await db.query(
      `SELECT * FROM public.slides_header`
    );

    res.render('slidesTemplate', {
      slides,
      baseUrl: req.baseUrl,
      modalClassDelete: 'btn-open-delete-header-slide-modal',
      actionCreate: '/slides-header/create',
      actionUpdate: '/slides-header/update',
      msgPageName: 'Слайды верха курсовки',
      msgNoData: 'На данный момент нет не одного слайда',
      msgAddBtn: 'Добавить слайд',
    });
  } catch (error) {
    errorResult(res, error);
  }
};

const createHeaderSlide = async (req, res) => {
  const { rows: types } = await db.query(
    `SELECT * FROM public.slides_header_types`
  );

  const { rows: pictures } = await db.query(`SELECT * FROM public.pictures`);

  try {
    res.render('slidesHeaderManage', {
      slide: {},
      types,
      pictures,
      baseUrl: req.baseUrl,
      msgPageName: 'Добавление слайда для верха курсовки',
      msgCreateBtn: 'Сохранить',
      actionSubmit: '/slides-header/create',
      actionBack: '/slides-header',
    });
  } catch (error) {
    errorResult(res, error);
  }
};

const postCreateHeaderSlide = async (req, res) => {
  try {
    const [name, text] = validation.str([req.body.name, req.body.text]);

    await db.query(
      `INSERT INTO public.slides_header(
        id_type,
        id_picture,

        name,
        time,
        text
      ) VALUES($1, $2, $3, $4, $5)`,
      [
        Number(req.body.typeId),
        Number(req.body.pictureId),
        name,
        Number(req.body.time),
        text,
      ]
    );

    res.redirect(`/slides-header`);
  } catch (error) {
    errorResult(res, error);
  }
};

const updateHeaderSlide = async (req, res) => {
  const {
    rows: slides,
  } = await db.query(`SELECT * FROM public.slides_header  WHERE id=$1`, [
    req.params.id,
  ]);

  const { rows: types } = await db.query(
    `SELECT * FROM public.slides_header_types`
  );

  const { rows: pictures } = await db.query(`SELECT * FROM public.pictures`);

  try {
    res.render('slidesHeaderManage', {
      slide: slides[0],
      types,
      pictures,
      baseUrl: req.baseUrl,
      msgPageName: `Изменение слайда "${slides[0].name}" для верха курсовки`,
      msgCreateBtn: 'Создать слайд',
      actionSubmit: `/slides-header/update/${slides[0].id}`,
      actionBack: '/slides-header',
    });
  } catch (error) {
    errorResult(res, error);
  }
};

const postUpdateHeaderSlide = async (req, res) => {
  try {
    const [name, text] = validation.str([req.body.name, req.body.text]);

    await db.query(
      `
        UPDATE public.slides_header
        SET
          id_type=$1,
          id_picture=$2,

          name=$3,
          time=$4,
          text=$5
        WHERE id=$6
      `,
      [
        Number(req.body.typeId),
        Number(req.body.pictureId),
        name,
        Number(req.body.time),
        text,
        req.params.id,
      ]
    );

    res.redirect(`/slides-header`);
  } catch (error) {
    errorResult(res, error);
  }
};

const deleteHeaderSlide = async (req, res) => {
  try {
    await db.query(`DELETE FROM public.slides_header WHERE id=$1`, [
      req.params.id,
    ]);

    res.redirect(`/slides-header`);
  } catch (error) {
    errorResult(res, error);
  }
};

module.exports = {
  getAllSlides,
  createHeaderSlide,
  postCreateHeaderSlide,
  updateHeaderSlide,
  postUpdateHeaderSlide,
  deleteHeaderSlide,
};
