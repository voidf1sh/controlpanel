function groupByMins(begin, data, minutes) {
	const beginDate = new Date(begin);
	let groups = {};
	let splitMinutes = [];
	const intervalsPerHour = 60 / minutes;
	for (let i = 1; i <= intervalsPerHour; i++) {
		splitMinutes.push((i * minutes));
	}	// (minutes: 15) splitMinutes = [15, 30, 45, 60]

	// Set the current date information for the first loop
	let current = {
		year: beginDate.getFullYear(),
		month: beginDate.getMonth(),
		date: beginDate.getDate(),
		hour: beginDate.getHours(),
		interval: splitMinutes.find(e => e > beginDate.getMinutes())
	}
	

	for (const row of data) {
		const dateString = new Date(row.timestamp)
		.setSeconds(0,0);
		const date = new Date(dateString);
		

		const match = {
			year: date.getFullYear() == current.year,
			month: date.getMonth() == current.month,
			date: date.getDate() == current.date,
			hour: date.getHours() == current.hour,
			interval: date.getMinutes() <= current.interval
		}

		if (date.getMinutes() == 0) {
			current.interval = splitMinutes[0];
		}
		const intervalTimestamp = new Date(dateString).setMinutes(current.interval,0,0);
		const intervalDate = new Date(intervalTimestamp);

		if (match.year) {
			if (match.month) {
				if (match.date) {
					if (match.hour) {
						if (match.interval) {
							if (!(Object.keys(groups).includes(intervalDate.toISOString()))) {
								groups[intervalDate.toISOString()] = [];
							}
							groups[intervalDate.toISOString()].push(row.temperature);
						} else {
							current.interval = splitMinutes.find(e => e > date.getMinutes());
							groups[intervalDate.toISOString()] = [];
							groups[intervalDate.toISOString()].push(row.temperature);
						}
					} else {
						current.hour = date.getHours();
						current.interval = splitMinutes.find(e => e > date.getHours());
						groups[intervalDate.toISOString()] = [];
						groups[intervalDate.toISOString()].push(row.temperature);
					}
				} else {
					current.date = date.getDate();
					current.hour = date.getHours();
					current.interval = splitMinutes.find(e => e > date.getHours());
					groups[intervalDate.toISOString()] = [];
					groups[intervalDate.toISOString()].push(row.temperature);
				}
			} else {
				current.month = date.getMonth();
				current.date = date.getDate();
				current.hour = date.getHours();
				current.interval = splitMinutes.find(e => e > date.getHours());
				groups[intervalDate.toISOString()] = [];
				groups[intervalDate.toISOString()].push(row.temperature);
			}
		} else {
			current.year = date.getFullYear();
			current.month = date.getMonth();
			current.date = date.getDate();
			current.hour = date.getHours();
			current.interval = splitMinutes.find(e => e > date.getHours());
			groups[intervalDate.toISOString()] = [];
			groups[intervalDate.toISOString()].push(row.temperature);
		}
	}
	for (const key in groups) {
		const averageTemp = this.getAverage(groups[key]);
		groups[key] = averageTemp;
	}
	return groups;
}

function groupByHours(begin, data, hours) {
	const beginDate = new Date(begin);
	let groups = {};
	let splitHours = [];
	const intervalsPerDay = 24 / hours;
	for (let i = 1; i <= intervalsPerDay; i++) {
		splitHours.push((i * hours));
	}	// (hours: 6) splitHours = [6, 12, 18, 24]

	// Set the current date information for the first loop
	let current = {
		year: beginDate.getFullYear(),
		month: beginDate.getMonth(),
		date: beginDate.getDate(),
		hour: beginDate.getHours(),
		interval: splitHours.find(e => e > beginDate.getHours())
	}
	

	for (const row of data) {
		const dateString = new Date(row.timestamp)
		.setMinutes(0,0,0);
		const date = new Date(dateString);
		

		const match = {
			year: date.getFullYear() == current.year,
			month: date.getMonth() == current.month,
			date: date.getDate() == current.date,
			interval: date.getHours() <= current.interval
		}

		if (date.getHours() == 0) {
			current.interval = splitHours[0];
		}
		const intervalTimestamp = new Date(dateString).setHours(current.interval,0,0,0);
		const intervalDate = new Date(intervalTimestamp);

		if (match.year) {
			if (match.month) {
				if (match.date) {
					if (match.interval) {
						if (!(Object.keys(groups).includes(intervalDate.toISOString()))) {
							groups[intervalDate.toISOString()] = [];
						}
						groups[intervalDate.toISOString()].push(row.temperature);
					} else {
						current.interval = splitHours.find(e => e > date.getHours());
						groups[intervalDate.toISOString()] = [];
						groups[intervalDate.toISOString()].push(row.temperature);
					}
				} else {
					current.date = date.getDate();
					current.interval = splitHours.find(e => e > date.getHours());
					groups[intervalDate.toISOString()] = [];
					groups[intervalDate.toISOString()].push(row.temperature);
				}
			} else {
				current.month = date.getMonth();
				current.date = date.getDate();
				current.interval = splitHours.find(e => e > date.getHours());
				groups[intervalDate.toISOString()] = [];
				groups[intervalDate.toISOString()].push(row.temperature);
			}
		} else {
			current.year = date.getFullYear();
			current.month = date.getMonth();
			current.date = date.getDate();
			current.interval = splitHours.find(e => e > date.getHours());
			groups[intervalDate.toISOString()] = [];
			groups[intervalDate.toISOString()].push(row.temperature);
		}
	}
	for (const key in groups) {
		const averageTemp = this.getAverage(groups[key]);
		groups[key] = averageTemp;
	}
	return groups;
}

function groupByHour(begin, data) {
	// groups = {
	// 	timestamp: [temperatures],
	// 	timestamp: [temperatures]
	// }
	const beginDate = new Date(begin);
	let groups = {};
	// Set the current date information for the first loop
	let current = {
		year: beginDate.getFullYear(),
		month: beginDate.getMonth(),
		date: beginDate.getDate(),
		hour: beginDate.getHours()
	}

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

		const match = {
			year: date.getFullYear() == current.year,
			month: date.getMonth() == current.month,
			date: date.getDate() == current.date,
			hour: date.getHours() == current.hour
		}

		if (match.year) {
			if (match.month) {
				if (match.date) {
					if (match.hour) {
						groups[date.toISOString()].push(row.temperature);
					} else {
						current.hour = date.getHours();
						groups[date.toISOString()] = [];
						groups[date.toISOString()].push(row.temperature);
					}
				} else {
					current.date = date.getDate();
					current.hour = date.getHours();
					groups[date.toISOString()] = [];
					groups[date.toISOString()].push(row.temperature);
				}
			} else {
				current.month = date.getMonth();
				current.date = date.getDate();
				current.hour = date.getHours();
				groups[date.toISOString()] = [];
				groups[date.toISOString()].push(row.temperature);
			}
		} else {
			current.year = date.getFullYear();
			current.month = date.getMonth();
			current.date = date.getDate();
			current.hour = date.getHours();
			groups[date.toISOString()] = [];
			groups[date.toISOString()].push(row.temperature);
		}
	}
	for (const key in groups) {
		const averageTemp = this.getAverage(groups[key]);
		groups[key] = averageTemp;
	}
	return groups;
}

function groupByDay(begin, data) {
	const beginDate = new Date(begin);
	let groups = {};
	// Set the current date information for the first loop
	let current = {
		year: beginDate.getFullYear(),
		month: beginDate.getMonth(),
		date: beginDate.getDate(),
	}

	for (const row of data) {
		const dateString = new Date(row.timestamp)
		.setHours(12,0,0,0);
		const date = new Date(dateString);
		if (!(Object.keys(groups).includes(date.toISOString()))) {
			groups[date.toISOString()] = [];
		}

		const match = {
			year: date.getFullYear() == current.year,
			month: date.getMonth() == current.month,
			date: date.getDate() == current.date
		}

		if (match.year) {
			if (match.month) {
				if (match.date) {
					groups[date.toISOString()].push(row.temperature);
				} else {
					current.date = date.getDate();
					groups[date.toISOString()] = [];
					groups[date.toISOString()].push(row.temperature);
				}
			} else {
				current.month = date.getMonth();
				current.date = date.getDate();
				groups[date.toISOString()] = [];
				groups[date.toISOString()].push(row.temperature);
			}
		} else {
			current.year = date.getFullYear();
			current.month = date.getMonth();
			current.date = date.getDate();
			groups[date.toISOString()] = [];
			groups[date.toISOString()].push(row.temperature);
		}
	}
	for (const key in groups) {
		const averageTemp = this.getAverage(groups[key]);
		groups[key] = averageTemp;
	}
	return groups;
}

function groupByRaw(data) {
	let groups = {};
	for (const row of data) {
		const timestampString = new Date(row.timestamp).setSeconds(0,0);
		const timestampDate = new Date(timestampString);
		groups[timestampDate.toISOString()] = row.temperature;
	}
	return groups;
}

function getAverage(array) {
	let runningTotal = 0;
	for (const e of array) {
		runningTotal += e;
	}
	return runningTotal / array.length;
}