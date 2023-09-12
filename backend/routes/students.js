const express = require('express');
const router = express.Router();

const {
	getAllStudents,
	addStudent,
	validateStudent,
} = require('../controllers/students');

// all auth routes

router.get('/', getAllStudents);
router.post('/', addStudent);
router.post('/validate/:studentNumber', validateStudent);

module.exports = router;
