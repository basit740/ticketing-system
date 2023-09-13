const express = require('express');
const router = express.Router();

const {
	getAllStudents,
	createStudent,
	validateStudent,
} = require('../p-sql/api/students');
// all auth routes

router.get('/', getAllStudents);
router.post('/', createStudent);
router.post('/validate/:studentNumber', validateStudent);

module.exports = router;
