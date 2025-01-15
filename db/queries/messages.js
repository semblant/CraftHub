const db = require('../connection');

const getMessages = (sender_id, receiver_id) => {

  return db.query(`SELECT * FROM messages WHERE sender_id = $1 AND receiver_id = $2 ORDER BY timestamp ASC;`, [sender_id, receiver_id])
    .then(data => {
      return data.rows;
    });
};

module.exports = { getMessages };
