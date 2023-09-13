const { Employee, db } = require('../db/index');
// const {db} = require('../db/index');

const genToken = require('../../utils/genToken');

exports.createEmployee = async (req, res, next) => {
	const employeeData = req.body;

	try {
		const createdEmployee = await Employee.create(employeeData);
		res.status(201).json({ success: true, employee: createdEmployee });
	} catch (err) {
		res.status(500).json({ success: false, message: err.message });
	}
};

exports.getAllEmployees = async (req, res, next) => {
	// const employeeData = req.body;

	try {
		const allEmployees = await Employee.findAll();
		res.status(200).json({ success: true, employees: allEmployees });
	} catch (err) {
		res.status(500).json({ success: false, message: err.message });
	}
};

exports.validateEmployee = async (req, res, next) => {
	const { birthDate } = req.body;

	let dateValidated = false;
	try {
		const foundEmp = await Employee.findOne({
			where: {
				employeeNumber: req.params.employeeNumber,
			},
		});

		if (
			foundEmp.birthDate.toISOString().split('T')[0].toString() ===
			birthDate.toString()
		) {
			dateValidated = true;
		}

		// create token

		let token = null;

		if (dateValidated) {
			token = genToken(foundEmp.id, 'employee');

			res
				.status(200)
				.json({ success: true, message: 'Validated', token: token });
		} else {
			res.status(400).json({ success: false, message: 'not validated!' });
		}
	} catch (err) {
		res.status(500).json({ success: false, message: err.message });
	}
};
