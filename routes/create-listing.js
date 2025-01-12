/* All routes for 'Create Listing' are defined here
*/


const express = require('express');
const db = require('../db/connection');
const router  = express.Router();


// Post method handles creating a listing, posts to route '/create-listing/'
router.post('/', (req, res) => {

});

module.exports = router;
