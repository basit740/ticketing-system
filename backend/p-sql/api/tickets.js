const { Ticket, Student, Employee, db } = require('../db/index');
const sendEmail = require('../../utils/sendEmail');
const { Op } = require('sequelize');
const path = require('path');

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

// GET ALL TICKETS
exports.getAllTickets = async (req, res, next) => {
	const allTickets = await getTodaysTickets();
	res.status(200).json({
		success: true,
		count: allTickets.length,
		tickets: allTickets,
	});
};

// DELETE ALL THE TICKETS

exports.deleteTickets = async (req, res) => {
	try {
		// Delete all records from the Ticket table
		await Ticket.destroy({
			where: {}, // Empty where clause to match all records
		});

		res.status(200).json({
			success: true,
		});
	} catch (error) {
		console.error('Error deleting tickets:', error);
		res.status(500).json({
			success: false,
			error: 'Internal Server Error',
		});
	}
};

exports.createTicket = async (req, res) => {
	try {
		const { studentNumber, employeeNumber, ticketEmail, subject, description } =
			req.body;

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

		if (student && student.id !== req.userId) {
			return res.status(403).json({
				success: false,
				message: 'Not a valid student',
			});
		}
		if (student && req.userType !== 'student') {
			return res.status(403).json({
				success: false,
				message: 'Not a valid student',
			});
		}
		if (employee && employee.id !== req.userId) {
			return res.status(403).json({
				success: false,
				message: 'Not a valid employee',
			});
		}
		if (employee && req.userType !== 'employee') {
			return res.status(403).json({
				success: false,
				message: 'Not a valid employee',
			});
		}

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
			student ? student.studentNumber : employee.employeeNumber,
			student ? 'student' : 'employee'
		);

		// console.log(result);

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
			'../../public/images/tickets',
			imageFileName
		);

		imageFile.mv(imagePath, (error) => {
			if (error) {
				console.error('Failed to save image:', error);
				return res.status(500).json({ error: 'Failed to save image' });
			}
		});

		const serverImgPath =
			process.env.SERVER_URL + `/images/tickets/${imageFileName}`;

		// END SAVE IMG FILE

		// TICKET CREATTION PROCESS
		await lock.acquire('createAsyncTicketLock', async () => {
			// OstudentNumber
			// const applicant = foundApplicant._id;

			// Generate new token numbers
			const newTicketNumber = await createNewTicketNumber();

			// Create the new token
			const newTicket = await Ticket.create({
				studentId: student ? student.id : null,
				employeeId: employee ? employee.id : null,
				ticketNumber: newTicketNumber,
				imgUrl: serverImgPath ? serverImgPath : '',
				description: description,
				ticketEmail: ticketEmail,
				subject: subject,
			});

			const jsonTicket = newTicket.toJSON();
			console.log({ jsonTicket });
			// // Emit the 'tokensUpdated' event
			// const socket = getSocketInstance();
			// socket.emit('tokensUpdated');

			let htmlMessage = `
			<html>
			<head>
			<style>
				header{
					width:100%;
					padding:15px 30px;
					background-color:#9775fa;
					color:white;
					font-size:32px;
				}
				h1{
					margin-bottom:24px;
				}
				p{
					margin-bottom:16px;
				}

				.container{
					width:600px;
					padding:20px 30px;
					margin: 0 auto;
				}
			</style>
			</head>
			
			<body>
			<div class='container'>
			<header>
			Ticket Email
			 </header>
			<h1>Congrats Mr/Ms> <span style="color:green;">
			${
				jsonTicket.studentId !== null
					? jsonTicket.studentId
					: jsonTicket.employeeId
			}</span></h1>
			<p>${jsonTicket.description}</p>
			<p>The ticket is created on ${jsonTicket.createdAt.toLocaleString()}</p>
			<p>This email has been sent from Ticketing System<p>
			</div>
			</body>
			</html>
			`;
			// send Email to ticketCreator
			await sendEmail({
				email: ticketEmail,
				subject: 'Ticket is Created!',
				message: htmlMessage,
			});

			// Send the response with the newly created token
			res.status(200).json({ success: true, newTicket: newTicket });
		});
	} catch (error) {
		// Handle any potential errors
		console.error('error here>>>>>>>>>>>>>>>>>>>>>>:'.red, error);
		res.status(500).json({ error: 'Failed to create ticket' });
	}
};

exports.findUserTicket = async (req, res) => {
	const allTickets = await getTodaysTickets();

	let userTicket = null;
	if (req.userType === 'student') {
		userTicket = allTickets.find(
			(ticket) => ticket.studentId === req.userId && ticket.status === 'waiting'
		);
	} else {
		userTicket = allTickets.find(
			(ticket) =>
				ticket.employeeId === req.userId && ticket.status === 'waiting'
		);
	}

	if (userTicket) {
		res.status(200).json({
			success: true,
			ticket: userTicket,
		});
	} else {
		res.status(400).json({
			success: false,
			ticket: userTicket,
		});
	}
};
// FIND UNRESOLVED EXISTING TICKETS
async function findExistingUnresolvedTicket(userNumber, userType) {
	const allTickets = await getTodaysTickets();

	if (allTickets.length === 0) {
		return false;
	}

	// const allTicketPlainObjs = allTickets.map((ticket) => ticket.toObject());
	// console.log(allTicketPlainObjs);

	let waitingUserTicket = allTickets.find((ticket) => {
		if (
			(ticket.status === 'waiting' &&
				ticket.Student &&
				userType === 'student' &&
				ticket.Student.studentNumber === +userNumber) ||
			(ticket.status === 'waiting' &&
				ticket.Employee &&
				userType === 'employee' &&
				ticket.Employee.employeeNumber === +userNumber)
		) {
			return ticket;
		}
	});

	// console.log({ waitingUserTicket });
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

//
