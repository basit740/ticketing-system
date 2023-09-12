const express = require('express');
const router = express.Router();

const {
	getAllTickets,
	createTicket,
	deleteTickets,
} = require('../controllers/tickets');

// all auth routes

router.get('/', getAllTickets);
router.post('/', createTicket);
router.delete('/', deleteTickets);

module.exports = router;
