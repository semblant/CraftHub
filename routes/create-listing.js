/* All routes for 'Create Listing' are defined here
*/
const express = require('express');
const db = require('../db/connection');
const router  = express.Router();

// Get method renders 'Create Listing' page
router.get('/', (req, res) => {
  // Store user information
  const currentUser = req.session.user_status ? req.session.user_status : null;
  const name = req.session.username;
  const currentUserId = req.session.userId;

  // Validate User
  if (!currentUserId || currentUser !== 1) return res.status(403).send('Unauthorized access') // Handle command injection
  if (currentUser === 2) return res.redirect('../'); // Redirect back to home page when clicked -- gonna get rid of this by including it in html instead

  res.render('create-listing', {currentUser, name});
});


// move to queries
/**
 * Adds item details to the data base
 *
 * @param {Object} item - the item to add to the database with fields: title, description, price, create user, etc.
 */
const createItem = function(item)  {
  console.log('item details: ', item)
  const query = `INSERT INTO items (title, description, price, category_id, status, user_id)
  VALUES ($1, $2, $3, $4, $5, $6) RETURNING id;`; // return item ID to use in addImages function
  const values = [item.itemTitle, item.itemDescription, item.itemPrice, 1, 'Available', item.userID]

  // Add item to 'items' table
  db.query(query, values)
    .then((itemData) => {
      const itemId = itemData.rows[0].id // store item ID from RETURNING data
      // Add images to DB
      addImages(itemId, item.itemImages);
    })
    .catch((err) => {
      console.log('Error with item creation', err);
      res.status(500).send('An error occured during item creation.');
    });
};

/**
 * Uses provided item ID to add associated images to database
 *
 * @param {Number} id - item ID to add to 'item_images' database
 * @param {String} images - URLs to add to 'item_images' database
 * @returns nothing???
 */
const addImages = function(id, images) {
  const query = `
  INSERT INTO item_images (item_id, image_url)
  VALUES ($1, $2);`;
  values = [id, images];

  return db.query(query, values)
    .catch((err) => {
      console.log('An error occured during image addition', err);
      res.status(500).send('An error occured during item creation');
    })
}

// Post method handles creating a listing, posts to route '/create-listing/'
router.post('/', (req, res) => {
  // Store user ID
  const currentUserId = req.session.userId
  const currentUser = req.session.user_status; // store 1 - admin user or 2 - regular user
  console.log('store user info - admin, ID: ', currentUser, currentUserId)

  // Validate User
  if (!currentUserId || currentUser !== 1) return res.status(403).send('Unauthorized access') // Handle command injection

  // Make fields required
  if (!req.body.title || !req.body.price || !req.body.description || !req.body.images) return res.status(400).send(`Fields cannot be blank`)

  // Store listing information
  const itemTitle = req.body.title;
  const itemPrice = req.body.price;
  const itemDescription = req.body.description
  const itemImages = req.body.images;


  // Add listing to DB
  const item = {itemTitle, itemPrice, itemDescription, itemImages, currentUserId}
  createItem(item)
  res.redirect('/');
});


module.exports = router;
