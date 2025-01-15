/*
 * All routes for User Data are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /api/users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();
const userMessages = require('../db/queries/messages');
const db = require('../db/connection');

router.get('/', (req, res) => {
  const name = req.session.username
  let senderId
  let receiverId

  if (name === 'Admin User') {
    senderId = 1;
    receiverId = 2;
  } else {
    senderId = 2;
    receiverId = 1;
  }

  userMessages.getMessages(senderId, receiverId)
    .then(messages => {
      res.json({ messages });
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
});

router.post('/', async (req, res) => {

  console.log(req.body.content);
  const content = req.body.content;
  const userId = req.session.username;

  if (!userId) {
    return res.status(401).json({ error: 'User not logged in' });
  }

  let senderId
  let receiverId

  if (userId === 'Admin User') {
    senderId = 1;
    receiverId = 2;
  } else {
    senderId = 2;
    receiverId = 1;
  }

  console.log(senderId, 'senderId');
  console.log(receiverId, 'receiverId');
  try {
    const query = `
    INSERT INTO messages (sender_id, receiver_id, content, isRead)
    VALUES ($1, $2, $3, $4) RETURNING *;
    `;
    const values = [senderId, receiverId, content, false];
    const result = await db.query(query, values);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error inserting message:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});


module.exports = router;
