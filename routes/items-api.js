const express = require('express');
const router = express.Router();
const itemQueries = require('../db/queries/items');

// Get all items
router.get('/', (req, res) => {
  itemQueries.getItemsWithImages()
    .then(items => {
      res.json({ items });
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
    });
});

// Filter items by price
router.get('/filter/price', (req, res) => {
  const { minPrice, maxPrice } = req.query;
  itemQueries.getItemsByPrice(minPrice, maxPrice)
    .then(items => {
      res.json({ items });
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
    });
});

// Get favorited items for a user
router.get('/favorites', (req, res) => {
  const userId = req.session.user_id;
  itemQueries.getFavoritedItems(userId)
    .then(items => {
      res.json({ items });
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
    });
});

module.exports = router;
