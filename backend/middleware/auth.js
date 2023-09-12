const jwt = require('jsonwebtoken');

const User = require('../models/User');

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
