/* All routes for 'Create Listing' are defined here
*/


const express = require('express');
const db = require('../db/connection');
const router  = express.Router();

// Get method renders 'Create Listing' page
router.get('/', (req, res) => {
  // Make sure user is Admin user (is_admin: 1), else redirect them back to home page
  const isAdmin = req.session.user_status;
  if (isAdmin === 2) return res.redirect('../'); // Redirect back to home page

  // Store user information
  const currentUser = req.session.user_status ? req.session.user_status : null;
  const name = req.session.username
  res.render('create-listing', {currentUser, name});
});


// move to queries
/**
 * Adds item details to the data base
 *
 * @param {Object} item - the item to add to the database with fields: title, description, price, create user, etc.
 */
const createItem = function(item)  {
  const query = `INSERT INTO items (title, description, price, category_id, status, user_id)
  VALUES ($1, $2, $3, $4, $5, $6)`;
  const values = [item.itemTitle, item.itemDescription, item.itemPrice, 1, 'Available', item.userID]
  console.log('createitem function values: ', values)

  // Add item to 'items' table
  db.query(query, values)
  .catch((err) => {
    console.log('Error with item creation', err);
    res.status(500).send('An error occured during item creation.');
  })


}

// for images, once item is created ID will auto create, need to query to get item ID then add images with same item ID


// Post method handles creating a listing, posts to route '/create-listing/'
router.post('/', (req, res) => {
  // Make fields required
  if (!req.body.title || !req.body.price || !req.body.description || !req.body.images) return res.status(400).send(`Fields cannot be blank`)

  // Store listing information
  const itemTitle = req.body.title;
  const itemPrice = req.body.price;
  const itemDescription = req.body.description
  const itemImages = req.body.images;

  // Store user ID
  const userID = req.session.user_id

  // Debug
  console.log('itemTitle', itemTitle);
  console.log('itemPrice', itemPrice);
  console.log('itemDescription', itemDescription);
  console.log('itemImages', itemImages);

  // Add listing to DB
  const item = {itemTitle, itemPrice, itemDescription, itemImages, userID}
  console.log('inside post route item: ', item);
  createItem(item)
  //.catch((err) => console.log('There was an error creating the listing.'))

});


module.exports = router;
