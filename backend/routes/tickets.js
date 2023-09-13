const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
	getAllTickets,
	createTicket,
	deleteTickets,
} = require('../controllers/tickets');

const { testTicket } = require('../p-sql/api/tickets');

// all auth routes

router.get('/', getAllTickets);
router.post('/', createTicket);
router.delete('/', deleteTickets);
router.get('/test', protect, testTicket);

module.exports = router;
