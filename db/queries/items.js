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

module.exports = { getItemsWithImages };
