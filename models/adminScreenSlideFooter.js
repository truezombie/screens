const db = require('../db');
const errorResult = require('../services/errorsHandling');

const createScreenFooterSlide = async (req, res) => {
  try {
    const { rows: slides } = await db.query(
      `SELECT * FROM public.slides_footer`
    );
    const {
      rows: screens,
    } = await db.query(`SELECT * FROM public.screens WHERE id=$1`, [
      req.params.id,
    ]);

    res.render('adminScreenSlideFooter', {
      currentSlide: [],
      slides,
      baseUrl: req.baseUrl,
      actionSubmit: `/screens/create-footer-screen/${req.params.id}`,
      actionBack: `/screens/update/${req.params.id}`,
      msgPageName: `Прикрепление слайда для низа курсовки - "${screens[0].name}"`,
      msgCreateBtn: 'Прикрепить слайд',
    });
  } catch (e) {
    errorResult(res, e);
  }
};

const postCreateScreenFooterSlide = async (req, res) => {
  try {
    await db.query(
      `
            INSERT INTO public.screen_footer_slides(
                id_slide,
                id_screen,
                size_text,
                show_slide
            ) VALUES($1, $2, $3, $4)`,
      [
        Number(req.body.slideId),
        Number(req.params.id),
        Number(req.body.sizeText),
        !!req.body.showSlide,
      ]
    );

    res.redirect(`/screens/update/${req.params.id}`);
  } catch (e) {
    errorResult(res, e);
  }
};

const updateScreenFooterSlide = async (req, res) => {
  try {
    const {
      rows: currentSlide,
    } = await db.query(
      `SELECT * FROM public.screen_footer_slides WHERE id=$1`,
      [req.params.id]
    );

    const { rows: slides } = await db.query(
      `SELECT * FROM public.slides_footer`
    );

    const { rows: screens } = await db.query(
      `
            SELECT public.screen_footer_slides.*, public.slides_footer.name FROM public.screen_footer_slides
            LEFT JOIN public.slides_footer ON public.slides_footer.id=public.screen_footer_slides.id_slide
            WHERE public.screen_footer_slides.id=$1
        `,
      [req.params.id]
    );

    res.render('adminScreenSlideFooter', {
      currentSlide: currentSlide[0],
      slides,
      baseUrl: req.baseUrl,
      actionSubmit: `/screens/update-footer-screen/${currentSlide[0].id}`,
      actionBack: `/screens/update/${screens[0].id_screen}`,
      msgPageName: `Прикрепление слайда для низа курсовки - "${screens[0].name}"`,
      msgCreateBtn: 'Прикрепить слайд',
    });
  } catch (e) {
    errorResult(res, e);
  }
};

const postUpdateScreenFooterSlide = async (req, res) => {
  try {
    await db.query(
      `
            UPDATE public.screen_footer_slides
            SET
                id_slide=$1,
                id_screen=$2,
                size_text=$3,
                show_slide=$4
            WHERE id=$5
        `,
      [
        Number(req.body.slideId),
        Number(req.body.screenId),
        Number(req.body.sizeText),
        !!req.body.showSlide,
        Number(req.params.id),
      ]
    );

    res.redirect(`/screens/update/${req.body.screenId}`);
  } catch (e) {
    errorResult(res, e);
  }
};

const postDeleteScreenFooterSlide = async (req, res) => {
  try {
    const { rows: deletedSlide } = await db.query(
      `
            DELETE FROM public.screen_footer_slides WHERE id=$1 RETURNING id_screen
        `,
      [req.params.id]
    );

    res.redirect(`/screens/update/${deletedSlide[0].id_screen}`);
  } catch (e) {
    errorResult(res, e);
  }
};

module.exports = {
  createScreenFooterSlide,
  updateScreenFooterSlide,
  postDeleteScreenFooterSlide,
  postCreateScreenFooterSlide,
  postUpdateScreenFooterSlide,
};
