const { Employee } = require('./p-sql/db/index.js');

const seedEmp = async () => {
	try {
		await Employee.bulkCreate([
			{
				firstName: 'John',
				lastName: 'Doe',
				birthDate: '01/01/1995',
				employeeNumber: 1,
				department: 'JavaScript',
			},
			{
				firstName: 'Jane',
				lastName: 'Smith',
				birthDate: '01/01/1995',
				employeeNumber: 2,
				department: 'HTML',
			},
			// Add more users as needed
		]);

		console.log('Users seeded successfully');
	} catch (error) {
		console.error('Failed to seed users:', error);
	}
};

module.exports = seedEmp;
