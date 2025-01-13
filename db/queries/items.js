const db = require('../connection');

const getItemsWithImages = () => {
  const query = `
    SELECT items.*, item_images.image_url
    FROM items
    LEFT JOIN item_images ON items.id = item_images.item_id;
  `;
  return db.query(query)
    .then(data => {
      return data.rows;
    });
};

const getItemsByPrice = (minPrice, maxPrice) => {
  const query = `
    SELECT items.*, item_images.image_url
    FROM items
    LEFT JOIN item_images ON items.id = item_images.item_id
    WHERE items.price BETWEEN $1 AND $2;
  `;
  return db.query(query, [minPrice, maxPrice])
    .then(data => {
      return data.rows;
    });
};

const getFavoritedItems = (userId) => {
  const query = `
    SELECT items.*, item_images.image_url
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

module.exports = { getItemsWithImages };
