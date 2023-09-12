const { Employee, db } = require('../db/index');
// const {db} = require('../db/index');

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
	const employeeData = req.body;

	try {
		const createdEmployee = await Employee.create(employeeData);
		res.status(201).json({ success: true, employee: createdEmployee });
	} catch (err) {
		res.status(500).json({ success: false, message: err.message });
	}
};
