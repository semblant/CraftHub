const db = require('../connection');

const getMessages = () => {
  return db.query('SELECT * FROM messages;')
    .then(data => {
      return data.rows;
    });
};

const insertMessage = () => {
  return db.query('INSERT INTO messages (sender_id, receiver_id, item_id, content, isRead)')
    .then(data => {
      return data.rows;
    });
}

module.exports = { getMessages };
