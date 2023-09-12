const db = require('./database');

const Ticket = require('./models/Ticket');
const Employee = require('./models/Employee');
const Student = require('./models/Student');

// create associations - database table relationships

// Define associations
Ticket.belongsTo(Employee, { foreignKey: 'employeeId' });
Ticket.belongsTo(Student, { foreignKey: 'studentId' });

Employee.hasMany(Ticket, { foreignKey: 'employeeId' });
Student.hasMany(Ticket, { foreignKey: 'studentId' });

// In addition, you can specify that a Ticket can be created by either an Employee or a Student.
// For this, you can add an optional association to Employee and Student models:

// Employee.hasMany(Ticket, { foreignKey: 'createdByEmployeeId' });
// Student.hasMany(Ticket, { foreignKey: 'createdByStudentId' });

// // In the Ticket model, you can add two foreign keys to represent the creator, one for Employee and one for Student:

// Ticket.belongsTo(Employee, {
// 	foreignKey: 'createdByEmployeeId',
// 	as: 'createdByEmployee',
// });
// Ticket.belongsTo(Student, {
// 	foreignKey: 'createdByStudentId',
// 	as: 'createdByStudent',
// });

module.exports = {
	db,
	Ticket,
	Employee,
	Student,
};
