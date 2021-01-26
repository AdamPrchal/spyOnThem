const db = require("../db")
const unsplash = require("../api/unsplash")
const { body, validationResult } = require("express-validator")

exports.location_list = async (req, res, next) => {
	const { rows } = await db.query(
		"select id_location as id, city, street_name, street_number, zip, country, name, latitude, longitude from location"
	)
	res.render("location/location_list", { query: rows })
}

exports.location_create_get = async (req, res, next) => {
	res.render("location/location_form", { color: "purple" })
}

exports.location_create_post = [
	body("city")
		.trim()
		.isLength({ min: 1 })
		.escape()
		.withMessage("City must be specified.")
		.isAlphanumeric()
		.withMessage("City has non-alphanumeric characters."),
	body("street_name")
		.trim()
		.isLength({ min: 1 })
		.escape()
		.withMessage("Street name must be specified.")
		.isAlphanumeric()
		.withMessage("Street name has non-alphanumeric characters."),
	body("street_number")
		.trim()
		.isLength({ min: 1 })
		.escape()
		.withMessage("Street number must be specified.")
		.isNumeric()
		.withMessage("Street number must contain only numbers"),
	body("codename")
		.trim()
		.isLength({ min: 1 })
		.escape()
		.withMessage("Codename must be specified."),
	body("zip")
		.trim()
		.isLength({ min: 1 })
		.escape()
		.withMessage("Zip number must be specified.")
		.isNumeric()
		.withMessage("Zip number must contain only numbers"),
	body("country")
		.trim()
		.isLength({ min: 1 })
		.escape()
		.withMessage("Country must be specified.")
		.isAlphanumeric()
		.withMessage("Country has non-alphanumeric characters."),
	body("latitude")
		.trim()
		.isLength({ min: 1 })
		.escape()
		.withMessage("Latitude must be specified.")
		.isFloat()
		.withMessage("Latitude must be float number"),
	body("longitude")
		.trim()
		.isLength({ min: 1 })
		.escape()
		.withMessage("Longitude must be specified.")
		.isFloat()
		.withMessage("Longitude must be float number"),

	async (req, res, next) => {
		const errors = validationResult(req)

		if (!errors.isEmpty()) {
			res.render("location/location_form", {
				location: req.body,
				errors: errors.array(),
				color: "purple",
			})
			return
		} else {
			const text =
				"INSERT INTO location (city, street_name, street_number, zip, country, name, latitude, longitude) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)"
			const values = [
				req.body.city,
				req.body.street_name,
				req.body.street_number,
				req.body.zip,
				req.body.country,
				req.body.codename,
				req.body.latitude,
				req.body.longitude,
			]
			db.query(text, values, (err, result) => {
				if (err) {
					return next(err)
				}
				res.redirect("/location")
			})
		}
	},
]

exports.location_detail = async (req, res, next) => {
	const { rows } = await db.query(
		`SELECT id_location AS id, location.street_name || ' ' || location.street_number AS street, location.zip || ' ' || location.city AS city, location.country, name, latitude, longitude FROM location WHERE id_location = ${req.params.id}`
	)
	let randomImage

	unsplash.search
		.getPhotos({
			query: "city",
			page: Math.floor(Math.random() * 10),
		})
		.then((result) => {
			switch (result.type) {
				case "error":
					console.log("error occurred: ", result.errors[0])
					next(result.errors[0])
				case "success":
					randomImage =
						result.response.results[Math.floor(Math.random() * 10)]
							.urls.small
					res.render("location/location_detail", {
						query: rows[0],
						image: randomImage,
					})
			}
		})
}

exports.location_delete = async (req, res, next) => {
	await db.query(
		`DELETE FROM location
        WHERE id_location = $1`,
		[req.params.id],
		(err, result) => {
			if (err) {
				return next(err)
			}
			req.flash("info", `Location with id ${req.params.id} deleted`)
			res.redirect("/location")
		}
	)
}
