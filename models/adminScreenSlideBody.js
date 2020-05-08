const db = require('../db');
const errorResult = require('../services/errorsHandling');

const createScreenBodySlide = async (req, res) => {
  try {
    const { rows: slides } = await db.query(`SELECT * FROM public.slides_body`);

    const {
      rows: screens,
    } = await db.query(`SELECT * FROM public.screens WHERE id=$1`, [
      req.params.id,
    ]);

    const { rows: mainSlide } = await db.query(
      `
            SELECT * FROM public.screen_body_slides 
            WHERE public.screen_body_slides.id_screen=$1
            AND public.screen_body_slides.is_main=TRUE`,
      [req.params.id]
    );

    res.render('adminScreenSlideBoby', {
      currentSlide: [],
      slides,
      disabledCheckboxMakeMain: mainSlide.length !== 0,
      baseUrl: req.baseUrl,
      actionSubmit: `/screens/create-body-screen/${req.params.id}`,
      actionBack: `/screens/update/${req.params.id}`,
      msgPageName: `Прикрепление слайда для средины курсовки - "${screens[0].name}"`,
      msgCreateBtn: 'Прикрепить слайд',
    });
  } catch (e) {
    errorResult(res, e);
  }
};

const postCreateScreenBodySlide = async (req, res) => {
  try {
    await db.query(
      `
            INSERT INTO public.screen_body_slides(
                id_slide,
                id_screen,
                size_titles,
                size_currency_rows,
                size_img,
                show_slide,
                is_main
            ) VALUES($1, $2, $3, $4, $5, $6, $7)`,
      [
        Number(req.body.slideId),
        Number(req.params.id),
        Number(req.body.sizeTitles),
        Number(req.body.sizeCurrencyRows),
        Number(req.body.sizeImage),
        !!req.body.showSlide,
        !!req.body.mainSlide,
      ]
    );

    res.redirect(`/screens/update/${req.params.id}`);
  } catch (e) {
    errorResult(res, e);
  }
};

const updateScreenBodySlide = async (req, res) => {
  try {
    const {
      rows: currentSlide,
    } = await db.query(`SELECT * FROM public.screen_body_slides WHERE id=$1`, [
      req.params.id,
    ]);

    const { rows: slides } = await db.query(`SELECT * FROM public.slides_body`);

    const { rows: screens } = await db.query(
      `
            SELECT public.screen_body_slides.*, public.slides_body.name FROM public.screen_body_slides
            LEFT JOIN public.slides_body ON public.slides_body.id=public.screen_body_slides.id_slide
            WHERE public.screen_body_slides.id=$1
        `,
      [req.params.id]
    );

    const { rows: mainSlide } = await db.query(
      `
            SELECT * FROM public.screen_body_slides 
            WHERE public.screen_body_slides.id_screen=$1
            AND public.screen_body_slides.is_main=TRUE`,
      [screens[0].id_screen]
    );

    res.render('adminScreenSlideBoby', {
      currentSlide: currentSlide[0],
      disabledCheckboxMakeMain:
        mainSlide.length !== 0 && !currentSlide[0].is_main,
      slides,
      baseUrl: req.baseUrl,
      actionSubmit: `/screens/update-body-screen/${currentSlide[0].id}`,
      actionBack: `/screens/update/${screens[0].id_screen}`,
      msgPageName: `Прикрепление слайда для средины курсовки - "${screens[0].name}"`,
      msgCreateBtn: 'Прикрепить слайд',
    });
  } catch (e) {
    errorResult(res, e);
  }
};

const postUpdateScreenBodySlide = async (req, res) => {
  try {
    await db.query(
      `
            UPDATE public.screen_body_slides
            SET
                id_slide=$1,
                id_screen=$2,
                size_titles=$3,
                size_currency_rows=$4,
                size_img=$5,
                is_main=$6,
                show_slide=$7
            WHERE id=$8
        `,
      [
        Number(req.body.slideId),
        Number(req.body.screenId),
        Number(req.body.sizeTitles),
        Number(req.body.sizeCurrencyRows),
        Number(req.body.sizeImage),
        !!req.body.mainSlide,
        !!req.body.showSlide,
        Number(req.params.id),
      ]
    );

    res.redirect(`/screens/update/${req.body.screenId}`);
  } catch (e) {
    errorResult(res, e);
  }
};

const postDeleteScreenBodySlide = async (req, res) => {
  try {
    const { rows: deletedSlide } = await db.query(
      `
            DELETE FROM public.screen_body_slides WHERE id=$1 RETURNING id_screen
        `,
      [req.params.id]
    );

    res.redirect(`/screens/update/${deletedSlide[0].id_screen}`);
  } catch (e) {
    errorResult(res, e);
  }
};

module.exports = {
  createScreenBodySlide,
  updateScreenBodySlide,
  postDeleteScreenBodySlide,
  postCreateScreenBodySlide,
  postUpdateScreenBodySlide,
};
