const jwt = require('jsonwebtoken');

const User = require('../models/User');

const { Employee, Student } = require('../p-sql/db/index');

exports.superAdminRoute = async (req, res, next) => {
	let token = null;

	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith('Bearer ')
	) {
		token = req.headers.authorization.split(' ')[1];
	}

	// check if token exist
	if (!token) {
		return res.status(403).json({
			success: false,
			message: 'No Valid Token found!',
		});
	}

	// verify token

	const decoded = jwt.verify(token, process.env.SECRET_KEY);
	const foundUser = await User.findById(decoded.userId);

	if (foundUser.role !== 'super_admin') {
		return res.status(403).json({
			success: false,
			message: 'Not Authorized!',
		});
	}
	next();
};

exports.superAdminAndAdmindRoute = async (req, res, next) => {
	let token = null;

	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith('Bearer ')
	) {
		token = req.headers.authorization.split(' ')[1];
	}

	// check if token exist
	if (!token) {
		return res.status(403).json({
			success: false,
			message: 'No Valid Token found!',
		});
	}

	// verify token

	const decoded = jwt.verify(token, process.env.SECRET_KEY);
	const foundUser = await User.findById(decoded.userId);

	const userRole = foundUser.role;

	if (userRole === 'super_admin' || userRole === 'admin') {
		next();
	} else {
		return res.status(403).json({
			success: false,
			message: 'Not Authorized (superAdminAndAdmindRoute)!',
		});
	}
};

exports.protect = async (req, res, next) => {
	let token = null;

	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith('Bearer ')
	) {
		token = req.headers.authorization.split(' ')[1];
	}

	try {
		const decoded = jwt.verify(token, process.env.SECRET_KEY);
		let foundUser = null;
		if (decoded.userType === 'student') {
			foundUser = await Student.findByPk(decoded.userId);
			req.userType = 'student';
		} else {
			foundUser = await Employee.findByPk(decoded.userId);
			req.userType = 'employee';
		}

		if (foundUser) {
			req.userId = foundUser.id;
			next();
		} else {
			return res.status(403).json({
				success: false,
				message: 'No Valid Token found!',
			});
		}

		// check if token exist
		if (!token) {
			return res.status(403).json({
				success: false,
				message: 'No Valid Token found!',
			});
		}
	} catch (err) {
		res.status(403).json({
			success: false,
			message: 'Not a valid token',
		});
	}
};

// decoded: { userId: 1, userType: 'student', iat: 1694620213, exp: 1694706613 }
