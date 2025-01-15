const db = require('../connection');

const getItemsWithImages = (userId) => {
  const query = `
    SELECT items.*, item_images.image_url,
           COALESCE(favorites.is_active, false) AS is_favorited
    FROM items
    LEFT JOIN item_images ON items.id = item_images.item_id
    LEFT JOIN favorites ON items.id = favorites.item_id AND favorites.user_id = $1;
  `;
  return db.query(query, [userId])
    .then(data => {
      return data.rows;
    });
};

const getItemsByPrice = (minPrice, maxPrice, userId) => {
  const query = `
    SELECT items.*, item_images.image_url,
           COALESCE(favorites.is_active, false) AS is_favorited
    FROM items
    LEFT JOIN item_images ON items.id = item_images.item_id
    LEFT JOIN favorites ON items.id = favorites.item_id AND favorites.user_id = $1
    WHERE items.price BETWEEN $2 AND $3;
  `;
  return db.query(query, [userId, minPrice, maxPrice])
    .then(data => {
      return data.rows;
    });
};

const getFavoritedItems = (userId) => {
  const query = `
    SELECT items.*, item_images.image_url,
           COALESCE(favorites.is_active, false) AS is_favorited
    FROM items
    JOIN favorites ON items.id = favorites.item_id
    LEFT JOIN item_images ON items.id = item_images.item_id
    WHERE favorites.user_id = $1 AND favorites.is_active = true;
  `;
  return db.query(query, [userId])
    .then(data => {
      return data.rows;
    });
};

const favoriteItem = (userId, itemId) => {
  const query = `
    INSERT INTO favorites (user_id, item_id, is_active)
    VALUES ($1, $2, true)
    ON CONFLICT (user_id, item_id)
    DO UPDATE SET is_active = NOT favorites.is_active
    RETURNING *;
  `;
  return db.query(query, [userId, itemId])
    .then(data => {
      return data.rows[0];
    });
};

module.exports = { getItemsWithImages, getItemsByPrice, getFavoritedItems, favoriteItem };
