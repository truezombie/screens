const db = require('../db');
const errorResult = require('../services/errorsHandling');
const validation = require('../services/validation');

const getAllCashboxes = async (req, res) => {
  try {
    const { rows: cashboxes } = await db.query(
      `SELECT * FROM public.cashboxes`
    );

    res.render('adminCashbox', {
      cashboxes,
      baseUrl: req.baseUrl,
      pageName: 'Кассы',
      withoutCashboxes: 'На данный момент нет не одной кассы',
    });
  } catch (error) {
    errorResult(res, error);
  }
};

const createCashbox = (req, res) => {
  try {
    res.render('adminManageCashbox', {
      baseUrl: req.baseUrl,
      pageName: 'Добавление кассы',
      submitLink: '/cashboxes/create',
      backLink: '/cashboxes',
    });
  } catch (error) {
    errorResult(res, error);
  }
};

const updateCashbox = async (req, res) => {
  try {
    const {
      rows: cashboxes,
    } = await db.query(`SELECT * FROM public.cashboxes WHERE id=$1`, [
      req.params.id,
    ]);

    res.render('adminManageCashbox', {
      baseUrl: req.baseUrl,
      pageName: `Изменение кассы - ${cashboxes[0].name}`,
      name: cashboxes[0].name,
      spreadsheet: cashboxes[0].google_sheet_links,
      submitLink: `/cashboxes/update/${req.params.id}`,
      backLink: '/cashboxes',
    });
  } catch (error) {
    errorResult(res, error);
  }
};

const postUpdateCashbox = async (req, res) => {
  const [name, spreadsheet] = validation.str([
    req.body.name,
    req.body.spreadsheet,
  ]);

  try {
    await db.query(
      `UPDATE public.cashboxes SET name=$1, google_sheet_links=$2 WHERE id=$3`,
      [name, spreadsheet, req.params.id]
    );

    res.redirect('/cashboxes');
  } catch (error) {
    errorResult(res, error);
  }
};

const postCashbox = async (req, res) => {
  try {
    const [name, spreadsheet] = validation.str([
      req.body.name,
      req.body.spreadsheet,
    ]);

    await db.query(
      `INSERT INTO public.cashboxes(name, google_sheet_links) VALUES($1, $2)`,
      [name, spreadsheet]
    );

    res.redirect('/cashboxes');
  } catch (error) {
    errorResult(res, error);
  }
};

const deleteCashbox = async (req, res) => {
  try {
    await db.query(`DELETE FROM public.cashboxes WHERE id = $1`, [
      req.params.id,
    ]);
    res.redirect('/cashboxes');
  } catch (error) {
    errorResult(res, error);
  }
};

module.exports = {
  getAllCashboxes,
  createCashbox,
  updateCashbox,
  postCashbox,
  deleteCashbox,
  postUpdateCashbox,
};
