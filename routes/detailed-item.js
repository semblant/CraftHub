const express = require('express');
const router = express.Router();
const db = require('../db/connection');


// move to helpers
const itemLookup = function(itemId) {
  const query = `
  SELECT
    *
  FROM items
  LEFT JOIN item_images ON item_id = items.id
  WHERE items.id = $1;`;
  return db.query(query, [itemId])
  .then((data) => {
    return data.rows[0];
  })
};

router.get('/:id', (req, res) => {
  // Store User info
  const currentUser = req.session.user_status ? req.session.user_status : null;
  const name = req.session.username

  // Store item information
  const itemId = req.params.id;

  //  Get object of item details
  const item = itemLookup(itemId);
  item.then((item) =>{
    const templateVars = {
      currentUser,
      name,
      id: item.id,
      title: item.title,
      description: item.description,
      price: item.price,
      created: item.created_at,
      userId: item.user_id,
      images: item.image_url
    };

    res.render('detailed-item', templateVars);
  })

});

module.exports = router;
