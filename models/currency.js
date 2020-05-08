const db = require('../db');
const errorResult = require('../services/errorsHandling');
const validation = require('../services/validation');

const getAllCurrencies = async (req, res) => {
  try {
    const { rows: currencies } = await db.query(
      `SELECT * FROM public.currencies ORDER BY id ASC`
    );

    res.render('adminCurrency', {
      pageName: 'Управление валютами',
      baseUrl: req.baseUrl,
      currencies,
    });
  } catch (error) {
    errorResult(res, error);
  }
};

const createCurrency = (req, res) => {
  try {
    res.render('adminManageCurrency', {
      pageName: 'Добавление новой схемы валюты',
      baseUrl: req.baseUrl,
      backLink: '/currencies',
      submitLink: '/currencies/create',
    });
  } catch (error) {
    errorResult(res, error);
  }
};

const postCreateCurrency = async (req, res) => {
  const [to, from] = validation.str([req.body.to, req.body.from]);

  try {
    await db.query(
      `INSERT INTO public.currencies(currency_sale, currency_purchase) VALUES($1, $2)`,
      [to, from]
    );

    res.redirect('/currencies');
  } catch (error) {
    errorResult(res, error);
  }
};

const updateCurrency = async (req, res) => {
  try {
    const {
      rows: currencies,
    } = await db.query(`SELECT * FROM public.currencies WHERE id=$1`, [
      req.params.id,
    ]);

    res.render('adminManageCurrency', {
      pageName: `Изменине схемы валют ${currencies[0].currency_sale} - ${currencies[0].currency_purchase}`,
      baseUrl: req.baseUrl,
      backLink: '/currencies',
      submitLink: `/currencies/update/${currencies[0].id}`,
      to: currencies[0].currency_sale,
      from: currencies[0].currency_purchase,
    });
  } catch (error) {
    errorResult(res, error);
  }
};

const postUpdateCurrency = async (req, res) => {
  const [to, from] = validation.str([req.body.to, req.body.from]);

  try {
    await db.query(
      `UPDATE public.currencies SET currency_sale=$1, currency_purchase=$2 WHERE id=$3`,
      [to, from, req.params.id]
    );

    res.redirect('/currencies');
  } catch (error) {
    errorResult(res, error);
  }
};

const postDeleteCurrency = async (req, res) => {
  try {
    await db.query(`DELETE FROM public.currencies WHERE id=$1`, [
      req.params.id,
    ]);

    res.redirect('/currencies');
  } catch (error) {
    errorResult(res, error);
  }
};

module.exports = {
  getAllCurrencies,
  createCurrency,
  updateCurrency,
  postCreateCurrency,
  postUpdateCurrency,
  postDeleteCurrency,
};
