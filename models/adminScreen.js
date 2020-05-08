const db = require('../db');
const errorResult = require('../services/errorsHandling');
const validation = require('../services/validation');

const getAllScreens = async (req, res) => {
  try {
    const { rows: screens } = await db.query(
      `
        SELECT public.screens.*, public.brands.name as brand_name, public.cashboxes.name as cashbox_name
        FROM public.screens 
        LEFT JOIN public.brands ON public.screens.id_brand=public.brands.id
        LEFT JOIN public.cashboxes ON public.screens.id_cashbox=public.cashboxes.id
      `
    );

    res.render('adminScreen', {
      screens,
      baseUrl: req.baseUrl,
      modalClassDelete: 'btn-open-delete-screen-modal',
      actionCreate: '/screens/create',
      actionUpdate: '/screens/update',
      msgPageName: 'Экраны',
      msgNoData: 'На данный момент нет не одного экрана',
      msgAddBtn: 'Добавить экран',
    });
  } catch (error) {
    errorResult(res, error);
  }
};

const createScreen = async (req, res) => {
  const { rows: brands } = await db.query(`SELECT * FROM public.brands`);

  const { rows: cashboxes } = await db.query(`SELECT * FROM public.cashboxes`);

  try {
    res.render('screenCreate', {
      screen: {},
      brands,
      cashboxes,
      baseUrl: req.baseUrl,
      msgPageName: 'Добавление нового экрана',
      msgCreateBtn: 'Добавить экран',
      actionSubmit: '/screens/create',
      actionBack: '/screens',
    });
  } catch (error) {
    errorResult(res, error);
  }
};

const postCreateScreen = async (req, res) => {
  try {
    const [name] = validation.str([req.body.name]);

    await db.query(
      `INSERT INTO public.screens(
        name,

        id_brand,
        id_cashbox,

        footer_height,
        show_footer
      ) VALUES($1, $2, $3, $4, $5)`,
      [
        name,

        Number(req.body.brandId),
        Number(req.body.cashboxId),
        Number(req.body.footerHeight),

        !!req.body.showFooter,
      ]
    );

    res.redirect(`/screens`);
  } catch (error) {
    errorResult(res, error);
  }
};

const updateScreen = async (req, res) => {
  const {
    rows: screens,
  } = await db.query(`SELECT * FROM public.screens WHERE id=$1`, [
    req.params.id,
  ]);

  const { rows: brands } = await db.query(`SELECT * FROM public.brands`);

  const { rows: cashboxes } = await db.query(`SELECT * FROM public.cashboxes`);

  const { rows: screenHeaderSlides } = await db.query(
    `
        SELECT public.screen_header_slides.*, public.slides_header.name 
        FROM public.screen_header_slides 
        LEFT JOIN public.slides_header ON public.screen_header_slides.id_slide=public.slides_header.id
        WHERE id_screen=$1
      `,
    [req.params.id]
  );

  const { rows: screenBodySlides } = await db.query(
    `
        SELECT public.screen_body_slides.*, public.slides_body.name 
        FROM public.screen_body_slides 
        LEFT JOIN public.slides_body ON public.screen_body_slides.id_slide=public.slides_body.id
        WHERE id_screen=$1
      `,
    [req.params.id]
  );

  const { rows: screenFooterSlides } = await db.query(
    `
        SELECT public.screen_footer_slides.*, public.slides_footer.name 
        FROM public.screen_footer_slides 
        LEFT JOIN public.slides_footer ON public.screen_footer_slides.id_slide=public.slides_footer.id
        WHERE id_screen=$1
      `,
    [req.params.id]
  );

  try {
    res.render('screenUpdate', {
      screen: screens[0],
      brands,
      cashboxes,
      screenHeaderSlides,
      screenBodySlides,
      screenFooterSlides,
      classDeleteScreenSlideHeader: 'btn-open-delete-screen-slide-header-modal',
      classDeleteScreenSlideBody: 'btn-open-delete-screen-slide-body-modal',
      classDeleteScreenSlideFooter: 'btn-open-delete-screen-slide-footer-modal',
      baseUrl: req.baseUrl,
      msgPageName: `Редактирование экрана - "${screens[0].name}"`,
      msgCreateBtn: 'Сохранить',
      msgNoData: 'На данный момент нет не одного слайда',
      actionSubmit: `/screens/update/${screens[0].id}`,
      actionBack: '/screens',
    });
  } catch (error) {
    errorResult(res, error);
  }
};

const postUpdateScreen = async (req, res) => {
  const [name] = validation.str([req.body.name]);

  try {
    await db.query(
      `
        UPDATE public.screens
        SET
          name=$1,
          id_brand=$2,
          id_cashbox=$3,
          footer_height=$4,
          show_footer=$5
        WHERE
          id=$6
      `,
      [
        name,
        Number(req.body.brandId),
        Number(req.body.cashboxId),
        Number(req.body.footerHeight),
        !!req.body.showFooter,
        req.params.id,
      ]
    );

    res.redirect(`/screens`);
  } catch (error) {
    errorResult(res, error);
  }
};

const postDeleteScreen = async (req, res) => {
  try {
    await db.query(`DELETE FROM public.screens WHERE id=$1`, [req.params.id]);

    res.redirect(`/screens`);
  } catch (error) {
    errorResult(res, error);
  }
};

module.exports = {
  getAllScreens,
  createScreen,
  updateScreen,
  postDeleteScreen,
  postCreateScreen,
  postUpdateScreen,
};
