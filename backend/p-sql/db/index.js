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


module.exports = {
	db,
	Ticket,
	Employee,
	Student,
};
