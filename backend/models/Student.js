const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
	firstName: String,
	lastName: String,
	studentNumber: {
		type: Number,
		unique: true,
	},
	birthDate: {
		type: Date,
	},
	department: {
		type: String,
		enum: ['COE', 'CEA', 'CBS', 'CAS' , 'CSSP', 'CCS', 'CHM', 'CIT'],
	},
	course: {
		type: String,
		enum: ['BSIT', 'BSCS', 'BSTC'],
	},
	section: {
		type: String,
		enum: ['A', 'B', 'C'],
	},
	yearLevel: {
		type: Number,
		enum: [1, 2, 3, 4],
	},
});

module.exports = mongoose.model('Student', studentSchema);
