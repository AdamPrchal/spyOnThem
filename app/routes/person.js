const express = require('express');
const router = express.Router();

const personController = require('../controllers/person');

router.get('/', personController.person_list);

module.exports = router;
