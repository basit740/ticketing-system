const express = require('express');
const User = require('./models/User');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const fileUpload = require('express-fileupload');

const {
	superAdminRoute,
	superAdminAndAdmindRoute,
} = require('./middleware/auth');
// CROSS ORIGIN RESOURCE SHARING
const server = express();

// configure .env
dotenv.config({
	path: './config/config.env',
});
// static folder
server.use(express.static(path.join(__dirname, 'public')));
server.use(express.json());
server.use(fileUpload());

const connectDB = require('./db.js');

// connectDB();

// all routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const studentRoutes = require('./routes/students');
const employeeRoutes = require('./routes/employees');
const ticketRoutes = require('./routes/tickets');

server.listen(8080, function () {
	console.log('listening on on port 8080');
});

// cors
server.use(cors());

server.get('/test', function (req, res) {
	res.send('welcome to the server');
});

// Mount routes
server.use('/api/auth', authRoutes);
server.use('/api/users', userRoutes);
server.use('/api/students', studentRoutes);
server.use('/api/employees', employeeRoutes);
server.use('/api/tickets', ticketRoutes);
