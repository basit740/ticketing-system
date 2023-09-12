const mongoose = require('mongoose');

const connectionString = process.env.DB_STRING;

const connectDB = async () => {
	const connObject = await mongoose.connect(connectionString, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});

	console.log('DATABASE CONNECTED');
};

module.exports = connectDB;
