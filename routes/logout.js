// Contains route for logout

const express = require('express');
const db = require('../db/connection');
const router  = express.Router();


// On 'logout' clear cookies
router.post('/', (req, res) => {
  // Clear cookies
  req.session = null;
  res.redirect('/');
});

module.exports = router;
