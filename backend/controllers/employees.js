const Employee = require('../models/Employee');

exports.getAllEmployees = async (req, res, next) => {
	const allEmployees = await Employee.find();
	res.status(200).json({
		success: true,
		employees: allEmployees,
	});
};

exports.addEmployee = async (req, res, next) => {
	try {
		const createdEmp = await Employee.create(req.body);
		res.status(201).json({
			success: true,
			employee: createdEmp,
		});
	} catch (err) {
		res.status(500).json({ success: false, message: err.message });
	}
};

exports.validateEmployee = async (req, res, next) => {
	try {
		const employeeNumber = req.params.employeeNumber;
		const { birthDate } = req.body;
		const allEmployees = await Employee.find();

		const foundEmp = allEmployees.find(
			(emp) => emp.employeeNumber === +employeeNumber
		);

		let dateValidated = false;
		if (foundEmp.birthDate.toISOString().split('T')[0] === birthDate) {
			dateValidated = true;
		}
		if (foundEmp && dateValidated) {
			res.status(200).json({
				success: true,
				message: 'Validated',
				employeeId: foundEmp.toObject()._id,
				employee: { ...foundEmp.toObject() },
			});
		} else {
			res.status(500).json({ success: false, message: 'not validated' });
		}
	} catch (err) {
		res.status(500).json({ success: false, message: err.message });
	}
};
