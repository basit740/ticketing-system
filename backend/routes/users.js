const express = require('express');
const router = express.Router();

const { getAllUsers, deleteUser, updateUser } = require('../controllers/users');

const {
	superAdminRoute,
	superAdminAndAdmindRoute,
} = require('../middleware/auth');

// all auth routes

router.get('/', superAdminAndAdmindRoute, getAllUsers);
router.delete('/:id', superAdminRoute, deleteUser);
router.put('/:id', superAdminRoute, updateUser);

module.exports = router;
