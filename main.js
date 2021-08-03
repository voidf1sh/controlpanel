const express = require('express');
const ejs = require('ejs');
const app = express();
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.listen(8090);

app.get('/', (req, res) => {
	res.render('pages/index');
});

app.get('/temps', (req, res) => {
	res.render('pages/temps');
})