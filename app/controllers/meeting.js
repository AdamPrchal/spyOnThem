const async = require("async")
const db = require("../db")
const { body, validationResult } = require("express-validator")

exports.meeting_list = async (req, res, next) => {
	const { rows } = await db.query("SELECT meeting.id_meeting, location.city, CONCAT(location.street_name, ' ', location.street_number), TO_CHAR(meeting.start :: TIMESTAMP, 'dd/mm/yyyy hh24:mi') AS start, meeting.description, TO_CHAR(meeting.duration :: TIME, 'hh24:mi') AS duration FROM meeting LEFT JOIN location ON meeting.id_location = location.id_location");
	res.render("meeting/meeting_list", {"query": rows});
}
