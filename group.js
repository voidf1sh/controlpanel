module.exports = {
	groupByHour(begin, data) {
		// groups = {
		// 	timestamp: [temperatures],
		// 	timestamp: [temperatures]
		// }
		const beginDate = new Date(begin);
		let groups = {};
		let currentYear = beginDate.getFullYear();
		let currentMonth = beginDate.getMonth();
		let currentDate = beginDate.getDate();
		let currentHour = beginDate.getHours();
		for (const row of data) {
			const date = new Date(row.timestamp);
			if (date.getFullYear() == currentYear) {
				if (date.getMonth() == currentMonth) {
					if (date.getDate() == currentDate) {
						if (date.getHours() == currentHour) {
							const hourTimestamp = date.setMinutes(0);
							if (Object.keys(groups).includes(hourTimestamp)) {
								groups[timestamp].push(row.temperature);
							} else {
								groups[timestamp] = [];
								groups[timestamp].push(row.temperature);
							}
						} else {
							currentHour = date.getHours();
							groups[timestamp] = [];
							groups[timestamp].push(row.temperature);
						}
					} else {
						currentDate = date.getDate();
						currentHour = date.getHours();
						groups[timestamp] = [];
						groups[timestamp].push(row.temperature);
					}
				} else {
					currentMonth = date.getMonth();
					currentDate = date.getDate();
					currentHour = date.getHours();
					groups[timestamp] = [];
					groups[timestamp].push(row.temperature);
				}
			} else {
				currentYear = date.getFullYear();
				currentMonth = date.getMonth();
				currentDate = date.getDate();
				currentHour = date.getHours();
				groups[timestamp] = [];
				groups[timestamp].push(row.temperature);
			}
		}
		return groups;
	}
}