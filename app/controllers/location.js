const async = require("async")
const db = require("../db")
const { body, validationResult } = require("express-validator")

exports.location_list = async (req, res, next) => {
	const { rows } = await db.query("SELECT * FROM location");
	res.render("location/location_list", {"query": rows});
}
