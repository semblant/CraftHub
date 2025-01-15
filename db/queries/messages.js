const db = require('../connection');

const getMessages = (sender_id, receiver_id) => {

  return db.query(`SELECT * FROM messages WHERE sender_id = $1 AND receiver_id = $2;`, [sender_id, receiver_id])
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
