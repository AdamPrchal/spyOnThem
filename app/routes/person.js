const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  res.render('person/person_list');
});

module.exports = router;
