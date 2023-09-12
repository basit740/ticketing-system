const express = require('express');
const router = express.Router();

const {
	getAllEmployees,
	addEmployee,
	validateEmployee,
} = require('../controllers/employees');

// all auth routes

router.get('/', getAllEmployees);
router.post('/', addEmployee);
router.post('/validate/:employeeNumber', validateEmployee);

module.exports = router;
