const mongoose = require('mongoose');

const userShema = new mongoose.Schema({
	email: String,
	password: String,
	role: {
		type: String,
		enum: ['admin', 'super_admin', 'staff'],
		default: 'staff',
	},
	firstName: String,
	lastName: String,
});

module.exports = mongoose.model('User', userShema);
