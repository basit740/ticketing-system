const { Student, db } = require('../db/index');
// const {db} = require('../db/index');

const genToken = require('../../utils/genToken');

exports.createStudent = async (req, res, next) => {
	const studentData = req.body;

	try {
		const createdStudent = await Student.create(studentData);
		res.status(201).json({ success: true, student: createdStudent });
	} catch (err) {
		res.status(500).json({ success: false, message: err.message });
	}
};

exports.getAllStudents = async (req, res, next) => {
	// const employeeData = req.body;

	try {
		const allStudents = await Student.findAll();
		res.status(200).json({ success: true, students: allStudents });
	} catch (err) {
		res.status(500).json({ success: false, message: err.message });
	}
};

exports.validateStudent = async (req, res, next) => {
	const { birthDate } = req.body;

	let dateValidated = false;
	try {
		const foundStd = await Student.findOne({
			where: {
				studentNumber: req.params.studentNumber,
			},
		});

		if (
			foundStd.birthDate.toISOString().split('T')[0].toString() ===
			birthDate.toString()
		) {
			dateValidated = true;
		}

		// create token

		let token = null;

		if (dateValidated) {
			token = genToken(foundStd.id, 'student');

			res
				.status(200)
				.json({
					success: true,
					message: 'Validated',
					token: token,
					student: foundStd,
				});
		} else {
			res.status(400).json({ success: false, message: 'not validated!' });
		}
	} catch (err) {
		res.status(500).json({ success: false, message: err.message });
	}
};
