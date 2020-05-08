const express = require('express');
const errorResult = require('../services/errorsHandling');
const db = require('../db');

const router = express.Router();

router.get('/:id', async (req, res) => {
  const { rows: brands } = await db.query(
    `
      SELECT 
      public.screens.show_footer,
      public.screens.footer_height,
      public.brands.*
      FROM public.screens 
      LEFT JOIN public.brands ON public.screens.id_brand=public.brands.id
      WHERE public.screens.id=$1;
    `,
    [req.params.id]
  );

  const HEADER_HEIGHT = 20;
  const FOOTER_HEIGHT = brands[0].show_footer ? brands[0].footer_height : 0;
  const BODY_HEIGHT = 100 - HEADER_HEIGHT - FOOTER_HEIGHT;

  res.render('screen', {
    brand: brands[0],
    heightHeader: HEADER_HEIGHT,
    heightBody: BODY_HEIGHT,
    heightFooter: FOOTER_HEIGHT,
    showFooter: brands[0].show_footer,
  });
});

router.get('/params/:id', async (req, res) => {
  try {
    const { rows: cashboxes } = await db.query(
      `
        SELECT public.cashboxes.google_sheet_links
        FROM public.screens LEFT JOIN public.cashboxes ON public.screens.id_cashbox=public.cashboxes.id
        WHERE public.screens.id=$1;
      `,
      [req.params.id]
    );

    const { rows: brands } = await db.query(
      `
      SELECT 
      public.screens.show_footer,
      public.screens.footer_height,
      public.brands.*
      FROM public.screens 
      LEFT JOIN public.brands ON public.screens.id_brand=public.brands.id
      WHERE public.screens.id=$1;
    `,
      [req.params.id]
    );

    const { rows: headers } = await db.query(
      `
      SELECT 
        public.screen_header_slides.id,
        public.screen_header_slides.size_text,
        public.slides_header.time,
        public.slides_header.text,
        public.slides_header.id_type,
        public.pictures.name as picture_name
      FROM public.screen_header_slides
      LEFT JOIN public.slides_header ON public.slides_header.id=public.screen_header_slides.id_slide
      LEFT JOIN public.pictures ON public.pictures.id=public.slides_header.id_picture
      WHERE public.screen_header_slides.show_slide=TRUE
      AND public.screen_header_slides.id_screen=$1;
    `,
      [req.params.id]
    );

    const { rows: footers } = await db.query(
      `
      SELECT 
        public.screen_footer_slides.id,
        public.screen_footer_slides.size_text,
        public.slides_footer.time,
        public.slides_footer.text,
        public.slides_footer.id_type,
        public.pictures.name as picture_name
      FROM public.screen_footer_slides
      LEFT JOIN public.slides_footer ON public.slides_footer.id=public.screen_footer_slides.id_slide
      LEFT JOIN public.pictures ON public.pictures.id=public.slides_footer.id_picture
      WHERE public.screen_footer_slides.show_slide=TRUE
      AND public.screen_footer_slides.id_screen=$1;
    `,
      [req.params.id]
    );

    const { rows: bodySlides } = await db.query(
      `
      SELECT 
        public.screen_body_slides.id,
        public.screen_body_slides.size_titles,
        public.screen_body_slides.size_currency_rows,
        public.screen_body_slides.size_img,
        public.screen_body_slides.is_main,
        public.slides_body.time,
        public.slides_body.title_purchase,
        public.slides_body.title_sale
      FROM public.screen_body_slides 
      LEFT JOIN public.slides_body ON public.slides_body.id=public.screen_body_slides.id_slide
      WHERE id_screen=$1 AND show_slide=TRUE;
    `,
      [req.params.id]
    );

    const { rows: currencies } = await db.query(
      `
      SELECT
       public.currencies.currency_sale,
       public.currencies.currency_purchase,
       public.screen_body_slides.id
      FROM public.slides_body_currencies
      LEFT JOIN public.currencies ON public.currencies.id=public.slides_body_currencies.id_currency
      LEFT JOIN public.screen_body_slides ON public.screen_body_slides.id_slide=public.slides_body_currencies.id_slide
      WHERE id_screen=$1
      AND show_slide=TRUE
      ORDER BY public.currencies.id ASC;
    `,
      [req.params.id]
    );

    const bodies = bodySlides.map((body) => {
      return {
        ...body,
        currencies: currencies.filter((item) => item.id === body.id),
      };
    });

    res.json({
      brand: brands[0],
      headers,
      footers,
      bodies,
      googleSheet: cashboxes[0].google_sheet_links,
    });
  } catch (error) {
    errorResult(error);
  }
});

module.exports = router;
