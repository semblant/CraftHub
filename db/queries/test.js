const db = require('../connection');

const getTest = () => {
  return db.query('SELECT * FROM widgets;')
    .then(data => {
      return data.rows;
    });
};

module.exports = { getTest };
