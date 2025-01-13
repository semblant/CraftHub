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
  .catch((err) => {
    console.log('An error occurred during item lookup.', err);
    res.send(500).status('Error during item lookup.')
  })
}

// Dynamic route to delete an item from the databse
router.post('/:id/delete', (req, res) => {
  // Store user info
  const currentUserId = Number(req.session.userId);

  // Store item info
  const itemId = req.params.id;
  const item = itemLookup(itemId);

  // Lookup item to get userID that created it
  item.then((data) => {
    console.log(data)
    itemCreatorId = data.user_id;

    // Validate User
    if (!currentUserId || currentUserId !== itemCreatorId) return res.status(403).send('Unauthorized access')

    // Execute query to delete item from table(s)
    const removed = removeItem(itemId, currentUserId)
    removed.then(()=> {
    res.redirect('/'); // redirect once complete
    });
  });
});

// move to helpers
const markAsSold = function(itemId) {
  const query = `
  UPDATE items
  SET status = 'Sold'
  WHERE id = $1;
  `
  return db.query(query, [itemId])
  .catch((err) => {
    console.log('An error occurred during item update', err);
    res.status(500).send('Error during item update');
  })
};

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

// Dynamic route to update item status to SOLD
router.post('/:id', (req, res) => {
  // Store user info
  const currentUserId = Number(req.session.userId);

  // Store item info
  const itemId = req.params.id;
  let itemCreatorId = null;
  const item = itemLookup(itemId);

  // Lookup item to get userID that created it
  item.then((data) => {
    console.log(data)
    itemCreatorId = data.user_id;

    console.log('stored info:', itemCreatorId, currentUserId)

    // Validate User
    if (!currentUserId || currentUserId !== itemCreatorId) return res.status(403).send('Unauthorized access')

    // Else mark item as sold
    const sellItem = markAsSold(itemId);
    sellItem.then(() =>{
    res.redirect('/');
    })
  })


});


router.get('/:id', (req, res) => {
  // Store User info
  const currentUser = req.session.user_status ? req.session.user_status : null; //checks if user is admin
  const currentUserId = req.session.userId ? Number(req.session.userId) : null;
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
