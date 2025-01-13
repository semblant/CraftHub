/*
 * All routes for User Data are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /api/users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();
const userQueries = require('../db/queries/messages');
const db = require('../db/connection');

router.get('/', (req, res) => {
  userQueries.getMessages()
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
  const [ content ] = req.body;
  const userId = req.session.username;

  if (!userId) {
    return res.status(401).json({ error: 'User not logged in' });
  }

  try {
    const query = `
    INSERT INTO messages (sender_id, receiver_id, content)
    VALUES ($1, $2, $3) RETURNING *;
    `;
    const values = [userId, req.body.receiver_id || 1, content];
    const result = await db.query(query, values);

    res.status(201).json(result.row[0]);
  } catch (error) {
    console.error('Error inserting message:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});


module.exports = router;
