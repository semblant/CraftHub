const express = require('express');
const router = express.Router();
const db = require('../db/connection');

//Move to helpers
const removeItem = function(itemId, userId) {
  const query = `
  DELETE FROM items
  WHERE items.id = $1
  AND user_id IN (SELECT id FROM users WHERE users.id = $2)
  ;
  `;
  return db.query(query, [itemId, userId])
  .then((data) => {
    console.log(data.rows)
    console.log('Item Deleted')
  })
  .catch((err) => {
    console.log('An error occurred during item lookup.', err);
    res.send(500).status('Error during item lookup.')
  })
}

// Dynamic route to delete an item from the databse
router.post('/:id/delete', (req, res) => {
  // Store user info
  const currentUser = req.session.user_status ? req.session.user_status : null;
  const currentUserId = req.session.userId

  // Validate User
  if (!currentUserId || currentUser !== 1) return res.status(403).send('Unauthorized access')

  // Store item info
  const itemId = req.params.id;

  // Execute query to delete item from table(s)
  const removed = removeItem(itemId, currentUser)

  removed.then(()=> {
    res.redirect('/'); // redirect once complete
  })
});

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
  const currentUser = req.session.user_status ? req.session.user_status : null; //checks if user is admin
  const currentUserId = req.session.userid ? req.session.userId : null;
  const name = req.session.username;

  // Store item information
  const itemId = req.params.id;

  //  Get object of item details
  const item = itemLookup(itemId);
  item.then((item) =>{
    const templateVars = {
      currentUserId,
      name,
      currentUser, //admin status
      id: item.id,
      title: item.title,
      description: item.description,
      price: item.price,
      created: item.created_at,
      createUserId: item.user_id,
      images: item.image_url
    };

    res.render('detailed-item', templateVars);
  })
});


module.exports = router;
