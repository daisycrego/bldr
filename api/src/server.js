const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const wordAPIrouter = require('../routes/wordAPI');
const cors = require('cors');
const app = express();
const http = require('http');
const mongoose = require('mongoose');

app.set('view engine', 'html');

const dbPath =
	"mongodb+srv://admin:admin@buildercluster.tafza.mongodb.net/builder?retryWrites=true&w=majority";
mongoose.connect(dbPath, {
	useNewUrlParser: true,
});
const db = mongoose.connection;
db.on("error", () => {
	console.log("> error occurred from the database");
});
db.once("open", () => {
	console.log("> successfully opened the database");
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'build')));


app.use('/wordAPI', wordAPIrouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.send('error');
});

app.get('/ping', function (req, res) {
 return res.send('pong');
});

app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

let port = process.env.PORT;
if (port == null || port == "") {
	port = 8080;
}
app.listen(port);

module.exports = app;
