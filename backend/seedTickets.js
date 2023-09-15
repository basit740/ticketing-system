const { Ticket } = require('./p-sql/db/index.js');

const seedTickets = async () => {
	try {
		await Ticket.bulkCreate([
			{
				ticketEmail: 'john@gmail.com',
				description: 'Student ticket',
				subject: 'Student ticket description',
				studentId: 1,
			},
			{
				ticketEmail: 'jane@gmail.com',
				description: 'Employee Ticket',
				subject: 'Employee ticket description',
				employeeId: 1,
			},
			// Add more users as needed
		]);

		console.log('Tickets seeded seeded successfully');
	} catch (error) {
		console.error('Failed to seed tickets:', error);
	}
};

module.exports = seedTickets;
