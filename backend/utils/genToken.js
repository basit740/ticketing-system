const jwt = require('jsonwebtoken');

const genToken = (userId, userType) => {
	return jwt.sign({ userId, userType }, process.env.SECRET_KEY, {
		expiresIn: process.env.JWT_EXPIRE,
	});
};

module.exports = genToken;
