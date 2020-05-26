const ANIMATION_DURATION = 1;
const ANIMATION_DELAY = 0.3;

const WS_RELOAD_STATUS = 'RELOAD';

function connect() {
  const url = window.location;
  const ws = new WebSocket(`ws://${url.hostname}:4000`);

  ws.onopen = function () {
    ws.onopen = () => {
      console.log('web socket connected'); // eslint-disable-line no-console
    };

    ws.onmessage = function (e) {
      if (e.data === WS_RELOAD_STATUS) {
        document.location.reload(true);
      }
    };

    ws.onclose = function (e) {
      console.log(
        'Socket is closed. Reconnect will be attempted in 1 second.',
        e.reason
      ); // eslint-disable-line no-console
      setTimeout(function () {
        connect();
      }, 1000);
    };

    ws.onerror = function (err) {
      console.error(
        'Socket encountered error: ',
        err.message,
        'Closing socket'
      ); // eslint-disable-line no-console
      ws.close();
    };
  };
}

connect();

const fetchScreenData = async () => {
  const url = window.location.href;
  const schemeId = url.substring(url.lastIndexOf('/') + 1);

  const fetchedScreenData = await fetch(`/screen/params/${schemeId}`);
  const screenData = await fetchedScreenData.json();

  return screenData;
};

const fetchBodySlidesData = async (link, bodies) => {
  // TODO: need to refactor
  const fetchedGoogleSheetData = await fetch(
    link
      .replace(
        'docs.google.com/spreadsheets/d/',
        'spreadsheets.google.com/feeds/list/'
      )
      .replace('/edit#gid=0', '/1/public/values?alt=json')
  );
  const googleSheetData = await fetchedGoogleSheetData.json();

  const keys = Object.keys(googleSheetData.feed.entry[1])
    .filter((item) => item.indexOf('gsx$') !== -1)
    .sort();

  const saleKey = keys[0];
  const purchaseKey = keys[2];
  const currencyKey = keys[1];
  const keyPath = '$t';

  const slides = bodies.map((body) => {
    const currencies = body.currencies.map((currency) => {
      const currentCurrency = googleSheetData.feed.entry.find(
        (googleSheetRow) =>
          googleSheetRow[currencyKey] &&
          googleSheetRow[currencyKey][keyPath] &&
          String(googleSheetRow[currencyKey][keyPath]).indexOf(
            currency.currency_purchase
          ) !== -1 &&
          String(googleSheetRow[currencyKey][keyPath]).indexOf(
            currency.currency_sale
          ) !== -1
      );

      if (!currentCurrency) {
        return {
          currency: '-',
          purchase: '-',
          sale: '-',
        };
      }

      return {
        currency: currency.currency_sale,
        purchase: currentCurrency[purchaseKey][keyPath].replace(',', '.'),
        sale: currentCurrency[saleKey][keyPath].replace(',', '.'),
      };
    });

    return {
      ...body,
      currencies,
    };
  });

  return slides;
};

const headerAnimations = [
  {
    show: 'animate__fadeIn',
    hide: 'animate__fadeOut',
  },
  {
    show: 'animate__fadeInLeft',
    hide: 'animate__fadeOutLeft',
  },
  {
    show: 'animate__fadeInRight',
    hide: 'animate__fadeOutRight',
  },
  {
    show: 'animate__fadeInTopLeft',
    hide: 'animate__fadeOuTopLeft',
  },
  {
    show: 'animate__fadeInTopRight',
    hide: 'animate__fadeOuTopRight',
  },
];
const bodyAnimations = [
  {
    showLeft: 'animate__fadeInLeft',
    showCenter: 'animate__fadeIn',
    showRight: 'animate__fadeInRight',
    hideLeft: 'animate__fadeOut',
    hideCenter: 'animate__fadeOut',
    hideRight: 'animate__fadeOut',
  },
  {
    showLeft: 'animate__bounceInLeft',
    showCenter: 'animate__fadeIn',
    showRight: 'animate__bounceInRight',
    hideLeft: 'animate__bounceOutLeft',
    hideCenter: 'animate__fadeOut',
    hideRight: 'animate__bounceOutRight',
  },
  {
    showLeft: 'animate__fadeInDown',
    showCenter: 'animate__fadeInDown',
    showRight: 'animate__fadeInDown',
    hideLeft: 'animate__fadeOutDown',
    hideCenter: 'animate__fadeOutDown',
    hideRight: 'animate__fadeOutDown',
  },
  {
    showLeft: 'animate__fadeInTopLeft',
    showCenter: 'animate__fadeIn',
    showRight: 'animate__fadeInTopRight',
    hideLeft: 'animate__fadeOutBottomLeft',
    hideCenter: 'animate__fadeOut',
    hideRight: 'animate__fadeOutBottomRight',
  },
  {
    showLeft: 'animate__backInLeft',
    showCenter: 'animate__zoomIn',
    showRight: 'animate__backInRight',
    hideLeft: 'animate__backOutLeft',
    hideCenter: 'animate__zoomOut',
    hideRight: 'animate__backOutRight',
  },
  {
    showLeft: 'animate__zoomInLeft',
    showCenter: 'animate__zoomIn',
    showRight: 'animate__zoomInRight',
    hideLeft: 'animate__zoomOutLeft',
    hideCenter: 'animate__zoomOut',
    hideRight: 'animate__zoomOutRight',
  },
];
const footerAnimations = [
  {
    show: 'animate__fadeIn',
    hide: 'animate__fadeOut',
  },
  {
    show: 'animate__fadeInLeft',
    hide: 'animate__fadeOutLeft',
  },
  {
    show: 'animate__fadeInRight',
    hide: 'animate__fadeOutRight',
  },
  {
    show: 'animate__fadeInBottomLeft',
    hide: 'animate__fadeOuBottomLeft',
  },
  {
    show: 'animate__fadeInBottomRight',
    hide: 'animate__fadeOuBottomRight',
  },
];

// ------------------------------------------------------------------

const getHeaderTemplate = (header, brand, animations) => {
  const animationShowClass = `animate__animated ${animations.show}`;
  const animationHideClass = `animate__animated ${animations.hide}`;
  const deleay = header.time - ANIMATION_DURATION;
  const hideAnimationDelay = `animation-delay: ${
    deleay < 0 ? header.time : deleay
  }s`;

  switch (header.id_type) {
    case 1:
      return `
        <div class='w-100 h-100 ${animationHideClass}' style="${hideAnimationDelay}">
          <div class='header-slide-type-1 ${animationShowClass}'>
              <p 
                  class="d-inline-block w-100 text-truncate m-0" 
                  style="color: ${brand.header_color_text}; font-size: ${header.size_text}em">${header.text}
              </p>
          </div>
        </div>
      `;
    case 2:
      return `
        <div class='w-100 h-100 ${animationHideClass}' style="${hideAnimationDelay}">
          <div class='header-slide-type-2 ${animationShowClass}'>
              <img src="../uploads/${header.picture_name}" alt="${header.picture_name}"/>
          </div>
        </div>
      `;
    case 3:
      return `
        <div class='w-100 h-100 ${animationHideClass}' style="${hideAnimationDelay}">
          <div class='header-slide-type-3 ${animationShowClass}'>
              <img src="../uploads/${header.picture_name}" alt="${header.picture_name}"/>
              <p 
                  class="d-inline-block w-100 text-truncate m-0" 
                  style="color: ${brand.header_color_text}; font-size: ${header.size_text}em">${header.text}
              </p>
          </div>
        </div>
      `;
    default:
      return `
        <div class='w-100 h-100 ${animationHideClass}' style="${hideAnimationDelay}">
          <div class='header-slide-type-1 ${animationShowClass}'>Слайд не определён</div>
        </div>
      `;
  }
};

const getBodyTemplate = (body, brand, animations) => {
  const animationLeftShowClass = `animate__animated ${animations.showLeft}`;
  const animationCenterShowClass = `animate__animated ${animations.showCenter}`;
  const animationRightShowClass = `animate__animated ${animations.showRight}`;

  const animationLeftHideClass = `animate__animated ${animations.hideLeft}`;
  const animationCenterHideClass = `animate__animated ${animations.hideCenter}`;
  const animationRightHideClass = `animate__animated ${animations.hideRight}`;

  return `
    <div class="screen-body h-100 d-flex flex-column justify-content-center align-items-center">
        <div 
            class="row w-100" 
            style="font-size:${body.size_titles}em"
        >
            <div
                class="col-5 p-0 text-right text-uppercase screen-body-title ${animationLeftShowClass}"
                style="color:${brand.body_color_text_purchase}"
            >
                <div class="w-100 h-100 ${animationLeftHideClass}" style="animation-delay: ${
    body.time - ANIMATION_DELAY
  }s">
                    ${body.title_purchase}
                </div>
            </div>
            <div class="col-2 p-0 ${animationCenterShowClass}"></div>
            <div 
                class="col-5 p-0 text-left text-uppercase screen-body-title ${animationRightShowClass}" 
                style="color:${brand.body_color_text_sale}"
            >
                <div class="w-100 h-100 ${animationRightHideClass}" style="animation-delay: ${
    body.time - ANIMATION_DELAY
  }s">
                    ${body.title_sale}
                </div>
            </div>
        </div>
        ${body.currencies
          .map((item, index) => {
            const hideIndexDelay = index + 1;
            return `
              <div 
                class="row w-100 screen-body-currency-row"
              >
                  <div
                    class="col-5 p-0 text-right ${animationLeftShowClass}"
                    style="
                        color: ${brand.body_color_values}; 
                        font-size: ${body.size_currency_rows}em;
                        animation-delay: ${index * ANIMATION_DELAY}s"
                  >
                    <div 
                        class="w-100 h-100 ${animationLeftHideClass}"
                        style="animation-delay: ${
                          body.time - hideIndexDelay * ANIMATION_DELAY
                        }s"
                    >
                        ${item.purchase}
                    </div>
                  </div>
                  <div 
                    class="col-2 p-0 ${animationCenterShowClass}"
                    style="animation-delay: ${index * ANIMATION_DELAY}s"
                  >
                    <div
                        class="currency-card-wrapper position-relative w-100 h-100 ${animationCenterHideClass}"
                        style="
                            perspective: ${body.size_currency_rows}em;
                            animation-delay: ${
                              body.time - hideIndexDelay * ANIMATION_DELAY
                            }s"
                    >
                        <div class="currency-card position-absolute w-100 h-100 text-center d-flex justify-content-center align-items-center">
                          <div 
                              class="front position-absolute w-100 h-100 d-flex justify-content-center align-items-center"
                              style="
                                  color: ${brand.body_color_currencies};
                                  font-size: ${
                                    body.size_currency_rows -
                                    body.size_currency_rows / 2
                                  }em;
                              "
                          >
                            ${item.currency.toLowerCase()}
                          </div>
                          <div class="back position-absolute w-100 h-100 d-flex justify-content-center align-items-center">
                            <div
                                style="transform: scale(${body.size_img});"
                                class="currency-flag currency-flag-${item.currency.toLowerCase()}"
                            ></div>
                          </div>
                        </div>
                    </div>
                  </div>
                  <div
                    class="col-5 p-0 text-left ${animationRightShowClass}"
                    style="
                        color: ${brand.body_color_values};
                        font-size: ${body.size_currency_rows}em;
                        animation-delay: ${index * ANIMATION_DELAY}s"
                  >
                    <div 
                        class="w-100 h-100 ${animationRightHideClass}"
                        style="animation-delay: ${
                          body.time - hideIndexDelay * ANIMATION_DELAY
                        }s"
                    >
                        ${item.sale}
                    </div>
                  </div>
              </div>
            `;
          })
          .join('')}
    </div>
  `;
};

const getFooterTemplate = (footer, brand, animations) => {
  const animationShowClass = `animate__animated ${animations.show}`;
  const animationHideClass = `animate__animated ${animations.hide}`;
  const deleay = footer.time - ANIMATION_DURATION;
  const hideAnimationDelay = `animation-delay: ${
    deleay < 0 ? footer.time : deleay
  }s`;

  switch (footer.id_type) {
    case 1:
      return `
        <div class='w-100 h-100 ${animationHideClass}' style="${hideAnimationDelay}">
            <div class='footer-slide-type-1 ${animationShowClass}'>
                <p 
                    class="d-inline-block m-0 text-center" 
                    style="color: ${brand.footer_color_text}; font-size: ${footer.size_text}em">${footer.text}
                </p>
            </div>
        </div>
      `;
    case 2:
      return `
        <div class='w-100 h-100 ${animationHideClass}' style="${hideAnimationDelay}">
          <div class='footer-slide-type-2 ${animationShowClass}'>
              <img src="../uploads/${footer.picture_name}" alt="${footer.picture_name}"/>
          </div>
        </div>
      `;
    case 3:
      return `
        <div class='w-100 h-100 ${animationHideClass}' style="${hideAnimationDelay}">
          <div class='footer-slide-type-3 ${animationShowClass}'>
              <p 
                  class="d-inline-block m-0" 
                  style="
                  color: ${brand.footer_color_text}; font-size: ${footer.size_text}em">${footer.text}
              </p>
              <img src="../uploads/${footer.picture_name}" alt="${footer.picture_name}"/>
          </div>
        </div>
      `;
    default:
      return `
        <div class='w-100 h-100 ${animationHideClass}' style="${hideAnimationDelay}">
            <div class='footer-slide-type-1 ${animationShowClass}'>Слайд не определён</div>
        </div>
      `;
  }
};

// ------------------------------------------------------------------

const getArrSum = (array, key) => {
  let result = null;

  for (let i = 0; i <= array.length - 1; i += 1) {
    result += array[i][key];
  }

  return result;
};

const getRandomArrayItem = (arr) => {
  return arr[Math.floor(Math.random() * arr.length)];
};

const getSlides = (slides, brand, getTemplate, node, animations) => {
  let delay = 0;

  $(node).html(getTemplate(slides[0], brand, getRandomArrayItem(animations)));

  slides.forEach((header, index) => {
    if (index !== 0) {
      delay += slides[index - 1].time * 1000;
      setTimeout(() => {
        $(node).html(
          getTemplate(header, brand, getRandomArrayItem(animations))
        );
      }, delay);
    }
  });
};

const renderSlides = (slides, brand, getTemplate, node, animations) => {
  if (slides && slides.length !== 0) {
    getSlides(slides, brand, getTemplate, node, animations);

    setInterval(() => {
      getSlides(slides, brand, getTemplate, node, animations);
    }, getArrSum(slides, 'time') * 1000);
  }
};

// ------------------------------------------------------------------

const renderSlidesBody = (
  slides,
  brand,
  getTemplate,
  node,
  googleSheet,
  animations
) => {
  if (slides && slides.length !== 0) {
    const mainSlide = slides.find((body) => body.is_main);
    const bodySlides = [];

    if (slides.length >= 2) {
      slides.forEach((item) => {
        if (!item.is_main) {
          mainSlide !== -1
            ? bodySlides.push(mainSlide, item)
            : bodySlides.push(item);
        }
      });
    } else {
      bodySlides.push(slides[0]);
    }

    if (bodySlides.length !== 0 && googleSheet) {
      fetchBodySlidesData(googleSheet, bodySlides).then((data) => {
        getSlides(data, brand, getTemplate, node, animations);
      });

      setInterval(() => {
        fetchBodySlidesData(googleSheet, bodySlides).then((data) => {
          getSlides(data, brand, getTemplate, node, animations);
        });
      }, getArrSum(bodySlides, 'time') * 1000);
    }
  }
};

const main = () => {
  fetchScreenData().then((screenData) => {
    const { headers, footers, bodies, googleSheet, brand } = screenData;

    renderSlides(
      headers,
      brand,
      getHeaderTemplate,
      '.screen-header',
      headerAnimations
    );

    renderSlides(
      footers,
      brand,
      getFooterTemplate,
      '.screen-footer',
      footerAnimations
    );

    renderSlidesBody(
      bodies,
      brand,
      getBodyTemplate,
      '.screen-main',
      googleSheet,
      bodyAnimations
    );
  });
};

$(document).ready(function () {
  main();
});
