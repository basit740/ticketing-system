const { DataTypes } = require('sequelize');
const db = require('../database');
// Define the Sequelize model for employees
const Employee = db.define('Employee', {
	firstName: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	lastName: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	employeeNumber: {
		type: DataTypes.INTEGER,
		allowNull: false,
		unique: true,
	},
	birthDate: {
		type: DataTypes.DATE,
	},
	department: {
		type: DataTypes.ENUM('HTML', 'CSS', 'JavaScript'),
	},
});

module.exports = Employee;
