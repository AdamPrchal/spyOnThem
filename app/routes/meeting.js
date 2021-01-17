const express = require('express');
const router = express.Router();

const meetingController = require('../controllers/meeting');

router.get('/', meetingController.meeting_list);

module.exports = router;
