/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into /users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();

router.get('/', (req, res) => {
  const currentUser = req.session.user_status ? req.session.user_status : null;
  const name = req.session.username
  res.render('messages', { currentUser, name });
});

module.exports = router;
