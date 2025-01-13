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

// Favorite an item
router.post('/:itemId/favorite', (req, res) => {
  const userId = req.session.user_id;
  const itemId = req.params.itemId;
  if (!userId) {
    return res.status(401).json({ error: 'User not logged in' });
  }
  itemQueries.favoriteItem(userId, itemId)
    .then(item => {
      res.json({ item });
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
    });
});

// Get favorited items for a user
router.get('/favorites', (req, res) => {
  const userId = req.session.user_id;
  if (!userId) {
    return res.status(401).json({ error: 'User not logged in' });
  }
  itemQueries.getFavoritedItems(userId)
    .then(items => {
      res.json({ items });
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
    });
});

module.exports = router;
