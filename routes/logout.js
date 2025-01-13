// Contains route for logout

const express = require('express');
const db = require('../db/connection');
const router  = express.Router();


// On 'logout' clear cookies
router.post('/', (req, res) => {
<<<<<<< HEAD
  //Clear cookies
  req.session = null;
  res.redirect('/');
=======

  console.log('attempting')
  //Clear cookies
  req.session = null;
  res.redirect('/');

>>>>>>> main
});

module.exports = router;
