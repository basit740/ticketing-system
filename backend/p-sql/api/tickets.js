const { Ticket, db } = require('../db/index');
// const {db} = require('../db/index');
exports.testTicket = async (req, res) => {
	// const response = await Ticket.deleteMany();

	res.status(200).json({
		success: true,
	});
};
