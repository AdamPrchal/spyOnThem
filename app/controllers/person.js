const fetch = require("node-fetch")
const db = require("../db")
const { body, validationResult } = require("express-validator")

exports.person_list = async (req, res, next) => {
	const { rows } = await db.query(
		"SELECT person.id_person AS id, person.nickname, person.first_name, person.last_name, location.city, TO_CHAR(person.birth_day :: DATE, 'dd/mm/yyyy') AS birth_day, person.height, person.gender FROM person LEFT JOIN location ON person.id_location = location.id_location"
	)
	res.render("person/person_list", { query: rows })
}

exports.person_detail = async (req, res, next) => {
	let randomImage

	let url = "https://faceapi.herokuapp.com/faces?n=1"
	let settings = { method: "Get" }
	await fetch(url, settings)
		.then((response) => response.json())
		.then((data) => {
			randomImage = data[0].image_url
		})

	const { rows } = await db.query(
		`SELECT person.id_person AS id, person.nickname, person.first_name, person.last_name, location.street_name || ' ' || location.street_number AS street, location.zip || ' ' || location.city AS city, location.country, TO_CHAR(person.birth_day :: DATE, 'dd/mm/yyyy') AS birth_day, person.height, person.gender FROM person LEFT JOIN location ON person.id_location = location.id_location WHERE person.id_person = ${req.params.id}`
	)
	res.render("person/person_detail", { query: rows[0], image: randomImage })
}

exports.person_create_get = async (req, res, next) => {
	const { rows } = await db.query(
		"SELECT location.id_location AS id, location.street_name || ' ' || location.street_number || ', ' || location.city AS name FROM location"
	)
	res.render("person/person_form", { color: "pink", locations: rows })
}

exports.person_create_post = [
	body("first_name")
		.trim()
		.isLength({ min: 1 })
		.escape()
		.withMessage("First name must be specified.")
		.isAlphanumeric()
		.withMessage("First name has non-alphanumeric characters."),
	body("last_name")
		.trim()
		.isLength({ min: 1 })
		.escape()
		.withMessage("Last name must be specified.")
		.isAlphanumeric()
		.withMessage("Last name has non-alphanumeric characters."),
	body("birthday", "Invalid birthday")
		.optional({ checkFalsy: true })
		.isISO8601()
		.toDate(),

	(req, res, next) => {
		const errors = validationResult(req)

		if (!errors.isEmpty()) {
			res.render("person/person_form", {
				person: req.body,
				errors: errors.array(),
				color: "pink",
			})
			return
		} else {
			const text =
				"INSERT INTO person (nickname, first_name, last_name, id_location, birth_day, height, gender) VALUES ($1,$2,$3,$4,$5,$6,$7)"
			const values = [
				req.body.nickname,
				req.body.first_name,
				req.body.last_name,
				req.body.location,
				req.body.birthday,
				Number(req.body.height) || null,
				req.body.gender,
			]
			db.query(text, values, (err, result) => {
				if (err) {
					return next(err)
				}
				res.redirect("/person")
			})
		}
	},
]
