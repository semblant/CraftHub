const express = require('express');
const router = express.Router();
const itemQueries = require('../db/queries/items');

router.get('/', (req, res) => {
  itemQueries.getItemsWithImages()
    .then(items => {
      res.json({ items });
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
    });
});

module.exports = router;
