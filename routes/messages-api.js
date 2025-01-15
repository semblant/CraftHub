/*
 * All routes for User Data are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /api/users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();
const { getMessages } = require('../db/queries/messages');
const db = require('../db/connection');

// Get route for retrieving messages from database to show in chat window
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

  getMessages(senderId, receiverId)
    .then(messages => {
      res
        .status(200)
        .json({ messages });
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });

});

// Post route for new sent messages
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

// Get route for sidebar list
router.get('/availableChat', (req, res) => {
  const loggedInUser = req.session.username;
  let otherUserId;

  // Determine who is logged in and who the other user is
  if (loggedInUser === 'Admin User') {
    otherUserId = 2; // Buyer
  } else {
    otherUserId = 1; // Admin
  }

  // Fetch the most recent message between the two users
  db.query(`
    SELECT * FROM messages 
    WHERE (sender_id = $1 AND receiver_id = $2) 
       OR (sender_id = $2 AND receiver_id = $1)
    ORDER BY timestamp DESC 
    LIMIT 1;`, [loggedInUser === 'Admin User' ? 1 : 2, otherUserId])
    .then(data => {
      const latestMessage = data.rows[0];
      const chatSidebarInfo = {
        otherUserId: otherUserId,
        lastMessage: latestMessage ? latestMessage.text : "No messages yet",
        timestamp: latestMessage ? latestMessage.timestamp : null
      };
      res.json(chatSidebarInfo);  // Send the sidebar data to the client
    })
    .catch(err => {
      console.error('Error fetching available chat:', err);
      res.status(500).send('Error fetching available chat');
    });
});


module.exports = router;
