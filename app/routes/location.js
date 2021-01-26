const express = require('express');
const router = express.Router();

const locationController = require('../controllers/location');

router.get('/', locationController.location_list);
router.get("/add", locationController.location_create_get)
router.post("/add", locationController.location_create_post)
router.get("/:id", locationController.location_detail)
router.get("/delete/:id", locationController.location_delete)

module.exports = router;
