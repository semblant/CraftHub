const db = require('../connection');

const getMessages = () => {
  return db.query('SELECT * FROM messages;')
    .then(data => {
      return data.rows;
    });
};

module.exports = { getMessages };
