const mysql = require('mysql');
const db = mysql.createConnection({
	host: process.env.dbHost,
	user: process.env.dbUser,
	password: process.env.dbPass,
	database: process.env.dbName
});

db.connect(err => {
	if (err) throw err;
	console.log('SQL Connected Successfully');
});

module.exports = {
	pad(input) {	// Add leading zeroes to dates that are missing them
		let output;
		if (input < 10) {
			output = '0' + input;
		} else {
			output = input;
		}
		return output;
	},
	dateToHTML(dateString) {
		const date = new Date(dateString);
		// HTML datetime-local format:
		// YYYY-MM-DDTHH:MM
		const d = {
			y: date.getFullYear(),
			mo: this.pad(date.getMonth() + 1),
			d: this.pad(date.getDate()),
			h: this.pad(date.getHours()),
			mi: this.pad(date.getMinutes())
		};

		return d.y + '-' + d.mo + '-' + d.d + 'T' + d.h + ':' + d.mi;
	},
	dateToSQL(dateString) {
		const date = new Date(dateString);
		// SQL timestamp format:
		// YYYY-MM-DD HH:MM:SS
		const d = {
			y: date.getFullYear(),
			mo: this.pad(date.getMonth() + 1),
			d: this.pad(date.getDate()),
			h: this.pad(date.getHours()),
			mi: this.pad(date.getMinutes()),
			s: this.pad(date.getSeconds())
		}

		return d.y + '-' + d.mo + '-' + d.d + ' ' + d.h + ':' + d.mi + ':' + d.s;
	},
	getTemperatures(begin, end, sensor, callback) {
		const query = `SELECT * FROM temperatures WHERE sensor_id = '${sensor}' AND timestamp BETWEEN '${begin}' AND '${end}'`;
		let results = 'peepeepoopoo';
		db.query(query,(err, res) => {
			if (err) throw err;
			return callback(res);
		});
	},
	groupByHour(begin, data) {
		// groups = {
		// 	timestamp: [temperatures],
		// 	timestamp: [temperatures]
		// }
		const beginDate = new Date(begin);
		let groups = {};
		// Set the current date information for the first loop
		let currentYear = beginDate.getFullYear();
		let currentMonth = beginDate.getMonth();
		let currentDate = beginDate.getDate();
		let currentHour = beginDate.getHours();

		for (const row of data) {
			const dateString = new Date(row.timestamp)
			.setMinutes(0,0,0);
			const date = new Date(dateString);
			if (!(Object.keys(groups).includes(date.toISOString()))) {
				// console.log({
				// 	text: 'Created new key',
				// 	keys: Object.keys(groups),
				// 	includes: Object.keys(groups).includes(date.toISOString())
				// });
				groups[date.toISOString()] = [];
			}

			const yearMatch = date.getFullYear() == currentYear;
			const monthMatch = date.getMonth() == currentMonth;
			const dateMatch = date.getDate() == currentDate;
			const hourMatch = date.getHours() == currentHour;

			if (yearMatch) {
				if (monthMatch) {
					if (dateMatch) {
						if (hourMatch) {
							const temp = row.temperature;
							const timestamp = row.timestamp;
							console.log({
								hourMatch,
								temp,
								timestamp
							});
							groups[date.toISOString()].push(row.temperature);
						} else {
							const temp = row.temperature;
							const timestamp = row.timestamp;
							console.log({
								hourMatch,
								temp,
								timestamp
							});
							currentHour = date.getHours();
							groups[date.toISOString()] = [];
							groups[date.toISOString()].push(row.temperature);
						}
					} else {
						currentDate = date.getDate();
						currentHour = date.getHours();
						groups[date.toISOString()] = [];
						groups[date.toISOString()].push(row.temperature);
					}
				} else {
					currentMonth = date.getMonth();
					currentDate = date.getDate();
					currentHour = date.getHours();
					groups[date.toISOString()] = [];
					groups[date.toISOString()].push(row.temperature);
				}
			} else {
				currentYear = date.getFullYear();
				currentMonth = date.getMonth();
				currentDate = date.getDate();
				currentHour = date.getHours();
				groups[date.toISOString()] = [];
				groups[date.toISOString()].push(row.temperature);
			}
		}
		for (const row of groups) {
			
		}
	}
}