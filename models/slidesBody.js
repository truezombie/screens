const format = require('pg-format');
const db = require('../db');
const errorResult = require('../services/errorsHandling');
const validation = require('../services/validation');

const getCurrencyValues = (schemaBodyId, currencies) =>
  currencies.map((currencyId) => [schemaBodyId, currencyId]);

const getAllSlides = async (req, res) => {
  try {
    const { rows: slides } = await db.query(`SELECT * FROM public.slides_body`);

    res.render('slidesTemplate', {
      slides,
      baseUrl: req.baseUrl,
      modalClassDelete: 'btn-open-delete-slide-modal',
      actionDelete: '/slides-body/delete',
      actionCreate: '/slides-body/create',
      actionUpdate: '/slides-body/update',
      msgPageName: 'Слайды средины курсовки',
      msgNoData: 'На данный момент нет не одного слайда',
      msgAddBtn: 'Добавить слайд',
    });
  } catch (error) {
    errorResult(res, error);
  }
};

const createBodySlide = async (req, res) => {
  const { rows: currencies } = await db.query(
    `SELECT * FROM public.currencies`
  );

  try {
    res.render('slidesBodyManage', {
      slide: {},
      currencies,
      baseUrl: req.baseUrl,
      msgPageName: 'Добавление слайда для средины курсовки',
      msgCreateBtn: 'Добавить слайд',
      actionSubmit: '/slides-body/create',
      actionBack: '/slides-body',
    });
  } catch (error) {
    errorResult(res, error);
  }
};

const postCreateBodySlide = async (req, res) => {
  try {
    const [name] = validation.str([req.body.name]);

    const result = await db.query(
      `INSERT INTO public.slides_body(
        name,
        time,
        
        title_purchase,
        title_sale
        ) VALUES($1, $2, $3, $4) RETURNING id`,
      [name, Number(req.body.time), req.body.titlePurchase, req.body.titleSale]
    );

    await db.query(
      format(
        `INSERT INTO public.slides_body_currencies(id_slide, id_currency) VALUES %L`,
        getCurrencyValues(Number(result.rows[0].id), [...req.body.currency])
      )
    );

    res.redirect('/slides-body');
  } catch (error) {
    errorResult(res, error);
  }
};

const updateBodySlide = async (req, res) => {
  try {
    const {
      rows: slides,
    } = await db.query(`SELECT * FROM public.slides_body WHERE id=$1`, [
      req.params.id,
    ]);

    const { rows: currenciesList } = await db.query(
      `SELECT * FROM public.currencies`
    );

    const {
      rows: selectedCurrencies,
    } = await db.query(
      `SELECT * FROM public.slides_body_currencies WHERE id_slide=$1`,
      [req.params.id]
    );

    const selectedCurrenciesIds = selectedCurrencies.map(
      (item) => item.id_currency
    );

    const currencies = currenciesList.map((item) => {
      return { ...item, checked: selectedCurrenciesIds.includes(item.id) };
    });

    res.render('slidesBodyManage', {
      slide: slides[0],
      currencies,
      baseUrl: req.baseUrl,
      msgPageName: `Изменение слайда "${slides[0].name}" для низа курсовки`,
      msgCreateBtn: 'Сохранить',
      actionSubmit: `/slides-body/update/${slides[0].id}`,
      actionBack: '/slides-body',
    });
  } catch (error) {
    errorResult(res, error);
  }
};

const postUpdateBodySlide = async (req, res) => {
  try {
    const [name, time] = validation.str([req.body.name, req.body.time]);

    await db.query(
      `
        UPDATE public.slides_body
        SET
          name=$1,
          time=$2,
          
          title_purchase=$3,
          title_sale=$4
        WHERE id=$5
      `,
      [
        name,
        Number(time),
        req.body.titlePurchase,
        req.body.titleSale,
        req.params.id,
      ]
    );

    await db.query(
      `DELETE FROM public.slides_body_currencies WHERE id_slide=$1`,
      [req.params.id]
    );

    if (req.body.currency && req.body.currency.length) {
      await db.query(
        format(
          `INSERT INTO public.slides_body_currencies(id_slide, id_currency) VALUES %L`,
          getCurrencyValues(Number(req.params.id), req.body.currency)
        )
      );
    }

    res.redirect(`/slides-body`);
  } catch (error) {
    errorResult(res, error);
  }
};

const deleteBodySlide = async (req, res) => {
  try {
    await db.query(`DELETE FROM public.slides_body WHERE id=$1`, [
      req.params.id,
    ]);

    res.redirect(`/slides-body`);
  } catch (error) {
    errorResult(res, error);
  }
};

module.exports = {
  getAllSlides,
  createBodySlide,
  updateBodySlide,
  deleteBodySlide,
  postCreateBodySlide,
  postUpdateBodySlide,
};
