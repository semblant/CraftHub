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
  });
});


/**
 * Queries the 'users' table for a specific user by ID
 *
 * @param {Number} userID - The userID to query for in the database
 * @returns {Promise<Object|undefined>} - resolves with user object if found, or undefined if no user exists
 */
const userLookup = async (userID) => {
  // Validate User (in case this function is used again elsewhere)
  if (!userID) {
    return Promise.reject(new Error('Invalid userID: cannot be empty'));
  }

  // Query specific user data
  const query = 'SELECT * FROM users WHERE id = $1;';
  const values = [userID];


  return db.query(query, values)
    .then(data => {
      return data.rows[0]; // return user object or undefined if not found
    })
    .catch((err) => {
      console.error('Error querying user:', err);
      throw err; // throw the error for handling in the calling function
    });
};

router.get('/:id', async (req, res) => {
  // Store User info
  const currentUser = req.session.user_status ? req.session.user_status : null; //checks if user is admin
  const currentUserId = req.session.userId ? Number(req.session.userId) : null;
  const name = req.session.username;

  // Store item information
  const itemId = req.params.id;

  try {
    // Get object of item details
    const item = await itemLookup(itemId);

    // Query the user's name in the DB based on item.user_id (creator of item)
    const user = await userLookup(item.user_id)

    // Store variables
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
      createUsername: user.name,
      images: item.image_url
    };

    res.render('detailed-item', templateVars);
  } catch (err) {
    console.log('An error occured retrieving item details', err);
    res.status(500).send('An error occured while retrieving item details')
  };
});


module.exports = router;
