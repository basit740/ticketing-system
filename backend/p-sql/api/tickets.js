const { Ticket, Student, Employee, db } = require('../db/index');
const { Op } = require('sequelize');

const { v4: uuidv4 } = require('uuid');
const asyncLock = require('async-lock');
const lock = new asyncLock();
// const {db} = require('../db/index');
exports.testTicket = async (req, res) => {
	// const response = await Ticket.deleteMany();

	res.status(200).json({
		success: true,
	});
};

exports.createTicket = async (req, res) => {
	try {
		const { studentNumber, employeeNumber, ticketEmail, subject, description } =
			req.body;

		// check the total tickets limit
		const totalTodaysTickets = await getTodaysTickets();

		// return res.status(200).json({ success: true, data: totalTodaysTickets });

		if (totalTodaysTickets.length >= process.env.TOTAL_TICKETS_LIMIT) {
			res.status(400).json({
				success: false,
				message: 'Ticket qouta for todays exceeded!',
			});
			return;
		}

		// return if existing ticket is there

		const result = await findExistingUnresolvedTicket(
			studentNumber ? studentNumber : employeeNumber
		);

		// console.log(result);

		if (result) {
			res.status(400).json({
				success: false,
				message: 'Waiting Ticket already exists!',
			});
			return;
		}

		const newTicketNumber = await createNewTicketNumber();

		res.status(200).json({
			success: true,
			data: newTicketNumber,
		});

		// const imageFile = req.files.file;

		// SAVE IMG FILE
		// const imageFileName = `image-${uuidv4()}.${imageFile.name
		// 	.split('.')
		// 	.pop()}`;
		// const imagePath = path.join(
		// 	__dirname,
		// 	'../public/images/tickets',
		// 	imageFileName
		// );

		// imageFile.mv(imagePath, (error) => {
		// 	if (error) {
		// 		console.error('Failed to save image:', error);
		// 		return res.status(500).json({ error: 'Failed to save image' });
		// 	}
		// });

		// const serverImgPath =
		// process.env.SERVER_URL + `/images/tickets/${imageFileName}`;

		// END SAVE IMG FILE

		let student = null;
		let employee = null;

		if (studentNumber) {
			student = await Student.findOne({
				where: {
					studentNumber: req.body.studentNumber,
				},
			});
		}

		if (employeeNumber) {
			employee = await Employee.findOne({
				where: {
					employeeNumber: req.body.employeeNumber,
				},
			});
		}

		// TICKET CREATTION PROCESS
		await lock.acquire('createAsyncTicketLock', async () => {
			// OstudentNumber
			// const applicant = foundApplicant._id;

			// Generate new token numbers
			const newTicketNumber = await createNewTicketNumber();

			// Create the new token
			const newTicket = await Ticket.create({
				student: student ? student : null,
				employee: employee ? employee : null,
				ticketNumber: newTicketNumber,
				imgUrl: serverImgPath ? serverImgPath : '',
				description: description,
				ticketEmail: ticketEmail,
				subject: subject,
			});

			// // Emit the 'tokensUpdated' event
			// const socket = getSocketInstance();
			// socket.emit('tokensUpdated');

			console.log('here');
			// Send the response with the newly created token
			res.status(201).json({ success: true, newTicket });
			return;
		});
	} catch (error) {
		// Handle any potential errors
		console.error(error);
		res.status(500).json({ error: 'Failed to create ticket' });
	}
};

// FIND UNRESOLVED EXISTING TICKETS
async function findExistingUnresolvedTicket(userNumber) {
	const allTickets = await getTodaysTickets();

	if (allTickets.length === 0) {
		return false;
	}

	// const allTicketPlainObjs = allTickets.map((ticket) => ticket.toObject());
	// console.log(allTicketPlainObjs);

	let waitingUserTicket = allTickets.find((ticket) => {
		if (
			(ticket.status === 'waiting' &&
				ticket.student &&
				ticket.student.studentNumber === +userNumber) ||
			(ticket.status === 'waiting' &&
				ticket.employee &&
				ticket.employee.employeeNumber === +userNumber)
		) {
			return ticket;
		}
	});

	if (waitingUserTicket) {
		return true;
	}

	return false;
}

// HELPER FUNCTIONS
const getTodaysTickets = async () => {
	// Get the current date
	const currentDate = new Date();

	// set the start and aend of teh current day
	const startOfDay = new Date(
		currentDate.getFullYear(),
		currentDate.getMonth(),
		currentDate.getDate()
	);

	const endOfDay = new Date(
		currentDate.getFullYear(),
		currentDate.getMonth(),
		currentDate.getDate(),
		23,
		59,
		59
	);

	try {
		// Use Sequelize's findAll method to query the database
		const tickets = await Ticket.findAll({
			where: {
				createdAt: {
					[Op.between]: [startOfDay, endOfDay],
				},
			},
			include: ['Employee', 'Student'], // Replace with your associations
		});

		return tickets;
	} catch (error) {
		// Handle any errors that may occur during the query
		console.error('Error fetching tickets:', error);
		throw error;
	}
};

// CREATE NEW TICKET NUMBER
async function createNewTicketNumber() {
	const today = new Date();
	const day = today.getDate();
	const month = today.getMonth();
	const year = today.getFullYear();

	try {
		// Find the last ticket created on the current day
		const lastTicket = await Ticket.findOne({
			where: {
				createdAt: {
					[Op.gte]: new Date(year, month, day),
					[Op.lt]: new Date(year, month, day + 1),
				},
			},
			order: [['ticketNumber', 'DESC']],
		});

		let newAutoIncrementNumber = 1;
		if (lastTicket) {
			// If there are tickets for the current day, increment the ticket number
			newAutoIncrementNumber = lastTicket.ticketNumber + 1;
		}

		return newAutoIncrementNumber;
	} catch (error) {
		console.error('Error creating a new ticket number:', error);
		throw error;
	}
}
