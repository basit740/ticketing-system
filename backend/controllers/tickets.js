const Ticket = require('../models/Ticket');
const Student = require('../models/Student');
const Employee = require('../models/Employee');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
// ⇨ '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'

const asyncLock = require('async-lock');
const lock = new asyncLock();
exports.getAllTickets = async (req, res, next) => {
	const allTickets = await getTodaysTickets();
	res.status(200).json({
		success: true,
		tickets: allTickets,
	});
};

exports.createTicket = async (req, res) => {
	try {
		const { studentNumber, employeeNumber, ticketEmail, subject, description } =
			req.body;

		// check the total tickets limit
		const totalTodaysTickets = await getTodaysTickets();

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

		console.log(result);

		if (result) {
			res.status(400).json({
				success: false,
				message: 'Waiting Ticket already exists!',
			});
			return;
		}

		const imageFile = req.files.file;

		// SAVE IMG FILE
		const imageFileName = `image-${uuidv4()}.${imageFile.name
			.split('.')
			.pop()}`;
		const imagePath = path.join(
			__dirname,
			'../public/images/tickets',
			imageFileName
		);
		// const imagePath =
		// 	process.env.SERVER_URL + '/public/images/recipies/' + imageFileName;

		imageFile.mv(imagePath, (error) => {
			if (error) {
				console.error('Failed to save image:', error);
				return res.status(500).json({ error: 'Failed to save image' });
			}
		});

		const serverImgPath =
			process.env.SERVER_URL + `/images/tickets/${imageFileName}`;

		// END SAVE IMG FILE

		let student = null;
		let employee = null;

		if (studentNumber) {
			student = await Student.findOne({ studentNumber });
		}

		if (employeeNumber) {
			employee = await Employee.findOne({ employeeNumber });
		}

		// Use async-lock to lock the token creation process
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

exports.deleteTickets = async (req, res) => {
	const response = await Ticket.deleteMany();

	res.status(200).json({
		success: true,
	});
};
// HELPER FUNCTIONS

async function createNewTicketNumber() {
	const today = new Date();
	const day = today.getDate();
	const month = today.getMonth();
	const year = today.getFullYear();

	// Check if there are any tokens for the current day
	const lastTicket = await Ticket.findOne({
		createdAt: {
			$gte: new Date(year, month, day),
			$lt: new Date(year, month, day + 1),
		},
	}).sort({ ticketNumber: -1 });

	let newAutoIncrementNumber = 1;
	if (lastTicket) {
		// If there are tokens for the current day, increment the token number
		console.log(
			'last auto -increment number ticket Number',
			lastTicket.autoIncrementNumber
		);
		newAutoIncrementNumber = lastTicket.ticketNumber + 1;
	}

	return newAutoIncrementNumber;
}

async function findExistingUnresolvedTicket(userNumber) {
	const allTickets = await getTodaysTickets();

	const allTicketPlainObjs = allTickets.map((ticket) => ticket.toObject());
	// console.log(allTicketPlainObjs);

	let waitingUserTicket = allTicketPlainObjs.find((ticket) => {
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

	const tickets = await Ticket.find({
		createdAt: { $gte: startOfDay, $lte: endOfDay },
	}).populate(['student', 'employee']);

	return tickets;
};
