const { DataTypes } = require('sequelize');

const db = require('../database');

const Ticket = db.define('Ticket', {
	ticketNumber: {
		type: DataTypes.INTEGER,
	},
	imgUrl: {
		type: DataTypes.STRING,
	},
	subject: {
		type: DataTypes.STRING,
	},
	description: {
		type: DataTypes.STRING,
	},
	ticketEmail: {
		type: DataTypes.STRING,
	},
	status: {
		type: DataTypes.ENUM(
			'waiting',
			'resolved',
			'unresolved',
			'escilated',
			'response'
		),
		defaultValue: 'waiting',
	},
	createdAt: {
		type: DataTypes.DATE,
		defaultValue: DataTypes.NOW,
	},
});

module.exports = Ticket;
