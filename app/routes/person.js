const express = require("express")
const router = express.Router()

const personController = require("../controllers/person")

router.get("/", personController.person_list)
router.get("/add", personController.person_create_get)
router.post("/add", personController.person_create_post)
router.get("/:id", personController.person_detail)
router.get("/delete/:id", personController.person_delete)

module.exports = router
