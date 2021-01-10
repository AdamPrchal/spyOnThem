const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  res.render('location/location_list');
});

module.exports = router;
