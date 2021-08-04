module.exports = {
	defaultSensor: "28-00000676d99f",
	debug: {
		demoData: [],
		demoLabels: [],
		generateData(count) {
			const tempMin = 65;
			const tempMax = 75;
			this.demoData = [];
			this.demoLabels = [];
			for (let i = 0; i < count; i++) {
				this.demoData.push(this.getRand(tempMin, tempMax));
				this.demoLabels.push(i);
			}
		},
		getRand(min, max) {
			return Math.floor(Math.random() * (max - min)) + min;
		}
	}
}