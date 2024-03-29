const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const wordAPIrouter = require('./routes/wordAPI');
const cors = require('cors');
const app = express();
const http = require('http');
const mongoose = require('mongoose');
const createError = require('http-errors');

app.set('view engine', 'html');

const dbPath =
    'mongodb+srv://admin:admin@buildercluster.tafza.mongodb.net/builder?retryWrites=true&w=majority';
mongoose.connect(dbPath, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const db = mongoose.connection;

db.on('error', () => {
    console.log('> error occurred from the database');
});
db.once('open', () => {
    console.log('> successfully opened the database');
});

app.use(bodyParser.urlencoded({ extended: false }));
//app.use(bodyParser.json());
app.use(cors());
//app.use(express.json());
//app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '..', 'build')));
app.listen(process.env.PORT || 5000, () => {
    console.log('server listening');
});
app.use(function (req, res, next) {
    setTimeout(next, 1000);
}); // INTENTIONAL LATENCY :)
app.use('/wordAPI', wordAPIrouter);

app.use((req, res, next) => {
    res.sendFile(path.join(__dirname, '..', 'build', 'index.html'));
});
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});
// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.send(`error`);
});

module.exports = app;
