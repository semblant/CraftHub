const express = require('express');
const router = express.Router();
const db = require('../db/connection');

router.get('/', (req, res) => {
  const currentUser = req.session.user_status ? req.session.user_status : null;
  const name = req.session.username
  db.query(`
    SELECT items.*, users.name AS username, item_images.image_url
    FROM items
    JOIN users ON items.user_id = users.id
    LEFT JOIN item_images ON items.id = item_images.item_id
  `)
  .then(data => {
    const items = data.rows;
    res.render('home', { currentUser, items, name });
  })
  .catch(err => {
    res.status(500).json({ error: err.message });
  });
});

module.exports = router;
