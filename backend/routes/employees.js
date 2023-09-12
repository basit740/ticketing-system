const express = require('express');
const router = express.Router();

// const {
// 	getAllEmployees,
// 	addEmployee,
// 	validateEmployee,
// } = require('../controllers/employees');

const {
	createEmployee,
	getAllEmployees,
	validateEmployee,
} = require('../p-sql/api/employees');

// all auth routes

router.get('/', getAllEmployees);
router.post('/', createEmployee);
router.post('/validate/:employeeNumber', validateEmployee);

module.exports = router;
