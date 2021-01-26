const express = require('express');
const router = express.Router();

const meetingController = require('../controllers/meeting');

router.get('/', meetingController.meeting_list);
router.get("/add", meetingController.meeting_create_get)
router.post("/add", meetingController.meeting_create_post)
router.get("/:id", meetingController.meeting_detail)
router.get("/delete/:id", meetingController.meeting_delete)

module.exports = router;
