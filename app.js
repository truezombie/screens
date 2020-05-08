require('dotenv').config();
const WebSocket = require('ws');
const createError = require('http-errors');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const {
  adminScreen,
  cashbox,
  picture,
  currency,
  brand,
  slidesHeader,
  slidesBody,
  slidesFooter,
} = require('./routes/index');
const screenRouter = require('./routes/screen');
const logInRouter = require('./routes/logIn');
const logOutRouter = require('./routes/logOut');

const app = express();

app.use(
  '/bootstrap.min.css',
  express.static(
    `${__dirname}/node_modules/bootstrap/dist/css/bootstrap.min.css`
  )
);
app.use(
  '/bootstrap.min.js',
  express.static(`${__dirname}/node_modules/bootstrap/dist/js/bootstrap.min.js`)
);
app.use(
  '/jquery.min.js',
  express.static(`${__dirname}/node_modules/jquery/jquery.min.js`)
);
app.use(
  '/animate.min.css',
  express.static(`${__dirname}/node_modules/animate.css/animate.min.css`)
);
app.use(
  '/currency-flags.min.css',
  express.static(
    `${__dirname}/node_modules/currency-flags/dist/currency-flags.min.css`
  )
);
app.use(
  '/spectrum.min.js',
  express.static(
    `${__dirname}/node_modules/spectrum-colorpicker2/dist/spectrum.min.js`
  )
);
app.use(
  '/spectrum.min.css',
  express.static(
    `${__dirname}/node_modules/spectrum-colorpicker2/dist/dist/spectrum.min.css`
  )
);

// Public Folder
app.use(express.static('./public'));

app.use(bodyParser.urlencoded({ extended: true }));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SECRET,
    name: 'app',
    proxy: false,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 3 * 60 * 60 * 1000 },
  })
);
const checkUser = (req, res, next) => {
  if (req.session.loggedIn) {
    next();
  } else if (
    req.body.username === process.env.USER_NAME &&
    req.body.password === process.env.PASSWORD
  ) {
    req.session.loggedIn = true;
    res.redirect('/cashboxes');
  } else {
    res.redirect('/login');
  }
};

const serverWs = new WebSocket.Server({ port: 4000 });
const WS_RELOAD_STATUS = 'RELOAD';

serverWs.on('connection', (ws) => {
  ws.on('message', (message) => {
    serverWs.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });
});

const ws = new WebSocket('ws://localhost:4000');

const reloadPage = (req, res, next) => {
  if (req.method === 'POST') {
    // TODO: CHECK CHREATE POST REQUEST
    ws.send(WS_RELOAD_STATUS);
  }

  next();
};

app.use(express.static(path.join(__dirname, 'public')));

app.use('/screen', screenRouter);
app.use('/login', logInRouter);
app.use('/logout', logOutRouter);
app.use('/pictures', checkUser, picture);
app.use('/cashboxes', checkUser, reloadPage, cashbox);
app.use('/currencies', checkUser, reloadPage, currency);
app.use('/brands', checkUser, reloadPage, brand);
app.use('/slides-header', checkUser, reloadPage, slidesHeader);
app.use('/slides-body', checkUser, reloadPage, slidesBody);
app.use('/slides-footer', checkUser, reloadPage, slidesFooter);
app.use('/screens', checkUser, reloadPage, adminScreen);
app.get('/', (req, res) => {
  res.redirect('/cashboxes');
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
