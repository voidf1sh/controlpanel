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
// Load in debugging options and data
const debug = require('./debug.js');
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

app.get('/', (req, res) => {
	res.render('pages/index');
});

app.get('/temps', (req, res) => {
	let datetime = {
		begin: "",
		end: ""
	};

	// Get the time as numbers for now and 24 hours ago
	const beginDate = new Date().getTime() - (60 * 60 * 24 * 1000);
	const endDate = new Date().getTime();
	// Convert them to ISO String
	datetime.begin = new Date(beginDate).toISOString();
	datetime.end = new Date(endDate).toISOString();
	// Find the last occurance of : so we can get rid of the seconds, milliseconds, and zulu indicator
	const beginIndex = datetime.begin.lastIndexOf(':')
	const endIndex = datetime.end.lastIndexOf(':');
	// Get rid of the end of the strings
	datetime.begin = datetime.begin.slice(0,beginIndex);
	datetime.end = datetime.end.slice(0,endIndex);

	res.render('pages/temps', {
		labels: debug.demoLabels,
		data: debug.demoData,
		begin: datetime.begin,
		end: datetime.end
	});
})