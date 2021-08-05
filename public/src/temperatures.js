module.exports = {
	groupByMins(begin, data, minutes) {
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
	},
	groupByHour(begin, data) {
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
							const temp = row.temperature;
							const timestamp = row.timestamp;
							// console.log({
							// 	match.hour,
							// 	temp,
							// 	timestamp
							// });
							groups[date.toISOString()].push(row.temperature);
						} else {
							const temp = row.temperature;
							const timestamp = row.timestamp;
							// console.log({
							// 	match.hour,
							// 	temp,
							// 	timestamp
							// });
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
	},
	getAverage(array) {
		let runningTotal = 0;
		for (const e of array) {
			runningTotal += e;
		}
		return runningTotal / array.length;
	}
}