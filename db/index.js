const { Pool } = require('pg');
const config = require('../config');

const pool = new Pool(config.devConfig);

pool.connect((err) => {
  if (err) {
    console.error('connection error', err.stack);
  } else {
    console.log('db connected');
  }
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
