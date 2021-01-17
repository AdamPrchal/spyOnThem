const async = require("async")
const db = require("../db")
const { body, validationResult } = require("express-validator")

exports.index_page = async (req, res, next) => {
	const { rows } = await db.query("SELECT (SELECT COUNT(*) FROM person) AS person_count ,(SELECT COUNT(*) FROM location) AS location_count, (SELECT COUNT(*) FROM contact_type) AS contact_type_count, (SELECT COUNT(*) FROM meeting) AS meeting_count");
    res.render('index', {"query": rows[0]});
}
