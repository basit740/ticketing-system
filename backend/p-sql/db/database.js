const Sequelize = require('sequelize');

let connString =
	'postgresql://postgres:357ErmlRwf3lnqdm@db.ymqeduabkxpgwdaharsw.supabase.co:5432/postgres';
const db = new Sequelize(connString, {
	logging: true,
});

module.exports = db;
