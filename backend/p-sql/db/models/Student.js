const { DataTypes } = require('sequelize');

const db = require('../database');
// Define the Sequelize model
const Student = db.define('Student', {
	firstName: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	lastName: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	studentNumber: {
		type: DataTypes.INTEGER,
		allowNull: false,
		unique: true,
	},
	birthDate: {
		type: DataTypes.DATE,
	},
	department: {
		type: DataTypes.ENUM(
			'COE',
			'CEA',
			'CBS',
			'CAS',
			'CSSP',
			'CCS',
			'CHM',
			'CIT'
		),
	},
	course: {
		type: DataTypes.ENUM('BSIT', 'BSCS', 'BSTC'),
	},
	section: {
		type: DataTypes.ENUM('A', 'B', 'C'),
	},
	yearLevel: {
		type: DataTypes.INTEGER,
		validate: {
			isIn: [[1, 2, 3, 4]],
		},
	},
});

module.exports = Student;
