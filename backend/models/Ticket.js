const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
	student: {
		type: mongoose.Schema.ObjectId,
		ref: 'Student',
	},

	employee: {
		type: mongoose.Schema.ObjectId,
		ref: 'Employee',
	},
	assignedTo: {
		type: mongoose.Schema.ObjectId,
		ref: 'User',
	},
	ticketNumber: {
		type: Number,
	},
	imgUrl: {
		type: String,
	},
	subject: {
		type: String,
	},
	description: {
		type: String,
	},
	ticketEmail: {
		type: String,
	},

	status: {
		type: String,
		enum: ['waiting', 'resolved', 'unresolved', 'escilated'],
		default: 'waiting',
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

module.exports = mongoose.model('Ticket', ticketSchema);
