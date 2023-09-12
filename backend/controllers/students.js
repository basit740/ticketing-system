const Student = require('../models/Student');

exports.getAllStudents = async (req, res, next) => {
	const allStudents = await Student.find();
	res.status(200).json({
		success: true,
		students: allStudents,
	});
};

exports.addStudent = async (req, res, next) => {
	try {
		const createdStd = await Student.create(req.body);
		res.status(201).json({
			success: true,
			student: createdStd,
		});
	} catch (err) {
		res.status(500).json({ success: false, message: err.message });
	}
};

exports.validateStudent = async (req, res, next) => {
	try {
		const studentNumber = req.params.studentNumber;
		const { birthDate } = req.body;

		const foundStudent = await Student.findOne({
			studentNumber: studentNumber,
		});

		let dateValidated = false;
		if (foundStudent.birthDate.toISOString().split('T')[0] === birthDate) {
			dateValidated = true;
		}
		if (foundStudent && dateValidated) {
			res.status(200).json({
				success: true,
				message: 'Validated',
				studentId: foundStudent.toObject()._id,
				student: { ...foundStudent.toObject() },
			});
		} else {
			res.status(500).json({ success: false, message: 'not validated' });
		}
	} catch (err) {
		res.status(500).json({ success: false, message: err.message });
	}
};

//&& foundStudent.birthDate====birthDate
