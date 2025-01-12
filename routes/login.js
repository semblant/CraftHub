/*
 * All routes for Login are defined here
 * Since this file is loaded in server.js into /users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const db = require('../db/connection');
const router  = express.Router();


// move to helpers
/**
 * Queries the 'users' table for a specific user by ID
 *
 * @param {Number} userID - The userID to query for in the database
 * @returns {Promise<Object|undefined>} - resolves with user object if found, or undefined if no user exists
 */
const userLookup = (userID) => {
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

// On successful "login" user is redirected to main page to display logged in menu options
router.post('/', (req, res) => {
  const userId = req.body.userId;

  // Validate user
  if (!userId) return res.status(400).send('Email/Password fields cannot be empty.');

  // Look up user asynchronously
  const currentUser = userLookup(userId); // lookup userID

  currentUser.then((user) => {
    // Check if user exists in DB
    if (!user) return res.status(400).send(`A user with ID ${userId} does not exist.`);


    // set cookie for username
    req.session.username = user.name;
    // If user exists, save cookie as 1 - admin, 2 - buyer
    user.is_admin ? req.session.user_status = 1  : req.session.user_status = 2;

    // redirect to root page
    res.redirect('/');
  })
    .catch((err) => {
    // Handle any errors that occur during async lookup
      console.log('Error during user lookup: ', err);
      res.status(500).send('An error occured during login.');
    });
});

module.exports = router;
