const db = require('../db');
const errorResult = require('../services/errorsHandling');
const validation = require('../services/validation');

const getAllBrands = async (req, res) => {
  try {
    const { rows: brands } = await db.query(`SELECT * FROM public.brands`);

    res.render('adminBrand', {
      brands,
      baseUrl: req.baseUrl,
      msgPageName: 'Бренды',
      msgWithoutBrands: 'На данный момент нет не одного бренда',
      msgAddBrand: 'Добавить бренд',
    });
  } catch (error) {
    errorResult(res, error);
  }
};

const createBrand = async (req, res) => {
  try {
    res.render('adminManageBrand', {
      brand: {},
      baseUrl: req.baseUrl,
      msgPageName: 'Добавление бренда',
      submitLink: '/brands/create',
      backLink: '/brands',
    });
  } catch (error) {
    errorResult(res, error);
  }
};

const postCreateBrand = async (req, res) => {
  try {
    const [name] = validation.str([req.body.name]);

    await db.query(
      `INSERT INTO public.brands(
        name,
	
        header_color_bg,
        header_color_text,
        
        body_color_bg,
        body_color_currencies,
        body_color_values,
        body_color_text_sale,
        body_color_text_purchase,
      
        footer_color_bg,
        footer_color_text
        ) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [
        name,
        req.body.headerColorBg,
        req.body.headerColorText,

        req.body.bodyColorBg,
        req.body.bodyColorCurrencies,
        req.body.bodyColorValues,
        req.body.bodyColorTextSale,
        req.body.bodyColorTextPurchase,

        req.body.footerColorBg,
        req.body.footerColorText,
      ]
    );

    res.redirect('/brands');
  } catch (error) {
    errorResult(res, error);
  }
};

const updateBrand = async (req, res) => {
  try {
    const {
      rows: brands,
    } = await db.query(`SELECT * FROM public.brands WHERE id=$1`, [
      req.params.id,
    ]);

    res.render('adminManageBrand', {
      brand: brands[0],
      baseUrl: req.baseUrl,
      msgPageName: `Изменение бренда - "${brands[0].name}"`,
      submitLink: `/brands/update/${brands[0].id}`,
      backLink: '/brands',
    });
  } catch (error) {
    errorResult(res, error);
  }
};

const postUpdateBrand = async (req, res) => {
  try {
    const [name] = validation.str([req.body.name]);

    await db.query(
      `
      UPDATE public.brands
      SET
        name=$1,
    
        header_color_bg=$2,
        header_color_text=$3,
        
        body_color_bg=$4,
        body_color_currencies=$5,
        body_color_values=$6,
        body_color_text_sale=$7,
        body_color_text_purchase=$8,
      
        footer_color_bg=$9,
        footer_color_text=$10
      WHERE id=$11`,
      [
        name,
        req.body.headerColorBg,
        req.body.headerColorText,

        req.body.bodyColorBg,
        req.body.bodyColorCurrencies,
        req.body.bodyColorValues,
        req.body.bodyColorTextSale,
        req.body.bodyColorTextPurchase,

        req.body.footerColorBg,
        req.body.footerColorText,
        req.params.id,
      ]
    );

    res.redirect('/brands');
  } catch (error) {
    errorResult(res, error);
  }
};

const postDeleteBrand = async (req, res) => {
  try {
    await db.query(`DELETE FROM public.brands WHERE id=$1`, [req.params.id]);

    res.redirect('/brands');
  } catch (error) {
    errorResult(res, error);
  }
};

module.exports = {
  getAllBrands,
  createBrand,
  updateBrand,
  postCreateBrand,
  postUpdateBrand,
  postDeleteBrand,
};
