const unsplash = require("../api/unsplash")
const db = require("../db")
const { body, validationResult } = require("express-validator")

exports.meeting_list = async (req, res, next) => {
	const { rows } = await db.query(
		`SELECT meeting.id_meeting AS id, location.city, CONCAT(location.street_name, ' ', location.street_number), TO_CHAR(meeting.start :: TIMESTAMP, 'dd/mm/yyyy hh24:mi') AS start, meeting.description, TO_CHAR(meeting.duration :: TIME, 'hh24:mi') AS duration FROM meeting LEFT JOIN location ON meeting.id_location = location.id_location`
	)
	res.render("meeting/meeting_list", { query: rows })
}

exports.meeting_create_get = async (req, res, next) => {
	const { rows } = await db.query(
		"SELECT location.id_location AS id, location.street_name || ' ' || location.street_number || ', ' || location.city AS name FROM location"
	)
	res.render("meeting/meeting_form", { color: "green", locations: rows })
}

exports.meeting_create_post = [
	body("description").trim().escape(),
	body("start", "Invalid start")
		.optional({ checkFalsy: true })
		.isISO8601()
		.toDate(),

	async (req, res, next) => {
		const errors = validationResult(req)

		if (!errors.isEmpty()) {
			const { rows } = await db.query(
				"SELECT location.id_location AS id, location.street_name || ' ' || location.street_number || ', ' || location.city AS name FROM location"
			)
			res.render("meeting/meeting_form", {
				meeting: req.body,
				errors: errors.array(),
				color: "green",
				locations: rows,
			})
			return
		} else {
			const text =
				"INSERT INTO meeting (start, description, duration, id_location) VALUES ($1,$2,$3,$4)"
			console.log(req.body)
			const values = [
				req.body.start,
				req.body.description,
				req.body.duration,
				req.body.location,
			]
			db.query(text, values, (err, result) => {
				if (err) {
					return next(err)
				}
				res.redirect("/meeting")
			})
		}
	},
]

exports.meeting_detail = async (req, res, next) => {
	const { rows } = await db.query(
		`SELECT meeting.id_meeting AS id, TO_CHAR(meeting.start, 'HH24:MI DD/MM/YYYY') AS start, TO_CHAR(meeting.duration, 'HH24:MI') as duration, location.street_name || ' ' || location.street_number AS street, location.zip || ' ' || location.city AS city, location.country, meeting.description FROM meeting LEFT JOIN location ON meeting.id_location = location.id_location WHERE meeting.id_meeting = ${req.params.id}`
	)
    let randomImage

	unsplash.search
		.getPhotos({
			query: "meeting",
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
					res.render("meeting/meeting_detail", {
						query: rows[0],
						image: randomImage,
					})
			}
		})

}

exports.meeting_delete = async (req, res, next) => {
	await db.query(
		`DELETE FROM meeting
        WHERE id_meeting = $1`,
		[req.params.id],
		(err, result) => {
			if (err) {
				return next(err)
			}
			req.flash("info", `Meeting with id ${req.params.id} deleted`)
			res.redirect("/meeting")
		}
	)
}