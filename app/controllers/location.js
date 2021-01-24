const async = require("async")
const db = require("../db")
const { body, validationResult } = require("express-validator")

exports.location_list = async (req, res, next) => {
	const { rows } = await db.query("select id_location as id, city, street_name, street_number, zip, country, name, latitude, longitude from location");
	res.render("location/location_list", {"query": rows});
}
