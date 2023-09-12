const mongoose = require('mongoose');

const empSchema = new mongoose.Schema({
	firstName: String,
	lastName: String,
	employeeNumber: {
		type: Number,
		unique: true,
	},
	birthDate: {
		type: Date,
	},
	department: {
		type: String,
		enum: ['HTML', 'CSS', 'JavaScript'],
	},
});

module.exports = mongoose.model('Employee', empSchema);
