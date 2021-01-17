const async = require("async")
const db = require("../db")
const { body, validationResult } = require("express-validator")

exports.person_list = async (req, res, next) => {
	const { rows } = await db.query("SELECT person.id_person, person.nickname, person.first_name, person.last_name, location.city, TO_CHAR(person.birth_day :: DATE, 'dd/mm/yyyy') AS birth_day, person.height, person.gender FROM person LEFT JOIN location ON person.id_location = location.id_location");
	res.render("person/person_list", {"query": rows});
}
