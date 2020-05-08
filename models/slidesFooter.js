const db = require('../db');
const errorResult = require('../services/errorsHandling');
const validation = require('../services/validation');

const getAllSlides = async (req, res) => {
  try {
    const { rows: slides } = await db.query(
      `SELECT * FROM public.slides_footer`
    );

    res.render('slidesTemplate', {
      slides,
      baseUrl: req.baseUrl,
      modalClassDelete: 'btn-open-delete-footer-slide-modal',
      actionCreate: '/slides-footer/create',
      actionUpdate: '/slides-footer/update',
      msgPageName: 'Слайды низа курсовки',
      msgNoData: 'На данный момент нет не одного слайда',
      msgAddBtn: 'Добавить слайд',
    });
  } catch (error) {
    errorResult(res, error);
  }
};

const createFooterSlide = async (req, res) => {
  const { rows: types } = await db.query(
    `SELECT * FROM public.slides_footer_types`
  );

  const { rows: pictures } = await db.query(`SELECT * FROM public.pictures`);

  try {
    res.render('slidesFooterManage', {
      slide: {},
      types,
      pictures,
      baseUrl: req.baseUrl,
      msgPageName: 'Добавление слайда для низа курсовки',
      msgCreateBtn: 'Сохранить',
      actionSubmit: '/slides-footer/create',
      actionBack: '/slides-footer',
    });
  } catch (error) {
    errorResult(res, error);
  }
};

const postCreateFooterSlide = async (req, res) => {
  try {
    const [name, text] = validation.str([req.body.name, req.body.text]);

    await db.query(
      `INSERT INTO public.slides_footer(
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

    res.redirect(`/slides-footer`);
  } catch (error) {
    errorResult(res, error);
  }
};

const updateFooterSlide = async (req, res) => {
  const {
    rows: slides,
  } = await db.query(`SELECT * FROM public.slides_footer WHERE id=$1`, [
    req.params.id,
  ]);

  const { rows: types } = await db.query(
    `SELECT * FROM public.slides_footer_types`
  );

  const { rows: pictures } = await db.query(`SELECT * FROM public.pictures`);

  try {
    res.render('slidesFooterManage', {
      slide: slides[0],
      types,
      pictures,
      baseUrl: req.baseUrl,
      msgPageName: `Изменение слайда "${slides[0].name}" для низа курсовки`,
      msgCreateBtn: 'Сохранить',
      actionSubmit: `/slides-footer/update/${slides[0].id}`,
      actionBack: '/slides-footer',
    });
  } catch (error) {
    errorResult(res, error);
  }
};

const postUpdateFooterSlide = async (req, res) => {
  try {
    const [name, text] = validation.str([req.body.name, req.body.text]);

    await db.query(
      `
        UPDATE public.slides_footer
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

    res.redirect(`/slides-footer`);
  } catch (error) {
    errorResult(res, error);
  }
};

const deleteFooterSlide = async (req, res) => {
  try {
    await db.query(`DELETE FROM public.slides_footer WHERE id=$1`, [
      req.params.id,
    ]);

    res.redirect(`/slides-footer`);
  } catch (error) {
    errorResult(res, error);
  }
};

module.exports = {
  getAllSlides,
  createFooterSlide,
  postCreateFooterSlide,
  updateFooterSlide,
  postUpdateFooterSlide,
  deleteFooterSlide,
};
