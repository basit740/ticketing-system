const User = require('../models/User');

exports.getAllUsers = async (req, res) => {
	try {
		const allUsers = await User.find();
		res.status(200).json({
			success: true,
			users: allUsers,
		});
	} catch (err) {
		res.status(400).json({ success: false, message: err.message });
	}
};

// DELETE A USER

exports.deleteUser = async (req, res) => {
	try {
		const userId = req.params.id;
		const allUsers = await User.findByIdAndDelete(userId);
		res.status(200).json({
			success: true,
			message: 'User deleted successfully',
		});
	} catch (err) {
		res.status(400).json({ success: false, message: err.message });
	}
};

// UPDATE A USER
exports.updateUser = async (req, res) => {
	try {
		const userId = req.params.id;
		console.log(req.body);
		const updatedUser = await User.findByIdAndUpdate(userId, req.body);
		res.status(200).json({
			success: true,
			message: 'User udpated successfully',
			user: updatedUser,
		});
	} catch (err) {
		res.status(400).json({ success: false, message: err.message });
	}
};
