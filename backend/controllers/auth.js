const bycrypt = require('bcrypt');
const User = require('../models/User');
// const jwt = require('jsonwebtoken');

const genToken = require('../utils/genToken');
exports.register = async (req, res, next) => {
	try {
		const { firstName, lastName, role, email, password } = req.body;

		const hashedPassword = await bycrypt.hash(password, 10);
		const createdUser = await User.create({
			firstName,
			lastName,
			email,
			role,
			password: hashedPassword,
		});

		res.status(201).json({
			success: true,
			user: createdUser,
		});
	} catch (e) {
		res.status(400).json({
			success: false,
			message: e.message,
		});
	}
};

exports.login = async (req, res, next) => {
	try {
		const { password, email } = req.body;
		const foundUser = await User.findOne({ email });

		if (!foundUser) {
			return res.status(401).json({
				success: false,
				message: 'Invalid password or email',
			});
		}

		const passwordMatch = await bycrypt.compare(password, foundUser.password);

		if (!passwordMatch) {
			return res.status(401).json({
				success: false,
				message: 'Invalid password or email',
			});
		}

		// create token and send jsonweb token
		const token = genToken(foundUser._id, foundUser);
		res.status(201).json({
			success: true,
			user: foundUser,
			token: token,
		});
	} catch (e) {
		res.status(400).json({
			success: false,
			message: e.message,
		});
	}
};

// helper functions

// const genToken = (userId) => {
// 	return jwt.sign({ userId }, process.env.SECRET_KEY, {
// 		expiresIn: process.env.JWT_EXPIRE,
// 	});
// };
