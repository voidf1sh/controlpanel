/*
*	Environment Variables:
*	dbAddress
*	dbName
*	dbUser
*	dbPass
*	listenPort
*/

// DotEnv for importing environment variables into the code
const dotenv = require('dotenv');
// Init dotenv
dotenv.config();
// Load in config options and debugging functions
const config = require('./config.js');
// Express to handle serving of files
const express = require('express');
// Embedded JS
const ejs = require('ejs');
// Init Express
const app = express();
// Tell express to use the files in public/
app.use(express.static('public'));
// Tell express to render using ejs
app.set('view engine', 'ejs');
// Have express listen on the port set in environment variables (.env)
app.listen(process.env.listenPort);
// Import custom functions module
const fn = require('./functions.js');

// Temporary import of temperatures for script testing
const temps = require('./public/src/temperatures.js');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
	res.render('pages/index');
});

app.get('/temps', (req, response) => {
	let htmldate = {};
	let sqldate = {};

	// Get the time as numbers for now and 24 hours ago
	const beginDate = new Date().getTime() - (60 * 60 * 24 * 1000);
	const endDate = new Date().getTime();
	// Convert them to be HTML datetime friendly
	htmldate.begin = fn.dateToHTML(beginDate);
	htmldate.end = fn.dateToHTML(endDate);
	// And SQL friendly
	sqldate.begin = fn.dateToSQL(beginDate);
	sqldate.end = fn.dateToSQL(endDate);

	const temperatures = fn.getTemperatures(sqldate.begin, sqldate.end, config.defaultSensor, (res) => {
		let labels = [];
		let data = [];
		for (const row of res) {
			labels.push(fn.dateToHTML(new Date(row.timestamp)));
			data.push(row.temperature);
		}

		response.render('pages/temps', {
			rawData: res,
			begin: htmldate.begin,
			end: htmldate.end
		});
	});
});

app.post('/temps', (req, response) => {
	let htmldate = {};
	let sqldate = {};

	// Get the time as numbers for now and 24 hours ago
	const beginDate = new Date(req.body.begin).getTime();
	const endDate = new Date(req.body.end).getTime();
	// Convert them to be HTML datetime friendly
	htmldate.begin = fn.dateToHTML(beginDate);
	htmldate.end = fn.dateToHTML(endDate);
	// And SQL friendly
	sqldate.begin = fn.dateToSQL(beginDate);
	sqldate.end = fn.dateToSQL(endDate);

	const temperatures = fn.getTemperatures(sqldate.begin, sqldate.end, req.body.sensor_id, (res) => {
		let labels = [];
		let data = [];
		for (const row of res) {
			labels.push(fn.dateToHTML(new Date(row.timestamp)));
			data.push(row.temperature);
		}

		response.render('pages/temps', {
			rawData: res,
			begin: htmldate.begin,
			end: htmldate.end
		});
	});
});