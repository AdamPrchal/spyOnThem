const async = require("async")
const db = require("../db")
const { body, validationResult } = require("express-validator")

exports.person_list = async (req, res, next) => {
	const { rows } = await db.query("SELECT * FROM person");
	res.render("person/person_list", {"query": rows});
}
