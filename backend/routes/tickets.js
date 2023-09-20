const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
	// getAllTickets,
	// createTicket,
	// deleteTickets,
} = require('../controllers/tickets');

const {
	testTicket,
	getAllTickets,
	createTicket,
	deleteTickets,
	findUserTicket,
} = require('../p-sql/api/tickets');

// all auth routes

router.get('/', getAllTickets);
router.post('/', protect, createTicket);
router.delete('/', deleteTickets);
router.get('/test', protect, testTicket);
router.get('/find-one', protect, findUserTicket);

module.exports = router;
