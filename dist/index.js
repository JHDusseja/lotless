'use strict';

var _database = require('./database');

var _items = require('./routes/items');

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');


var index = require('./routes/index');

var app = express();

var port = '6565';
app.set('port', port);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/items', _items.itemsrouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

app.listen(port, function (req, res) {
    console.log('Listening on port: ' + port);
});

(0, _database.getConnection)().then(function (connection) {
    connection.release();
    // let server = http.createServer(app);
    // server.listen(port, function (req, res) {
    //     console.log(`Listening on port: ${port}`);
    // });
    // app.listen(port, function (req, res) {
    //     console.log(`Listening on port: ${port}`);
    // });
}).catch(function (err) {
    console.log(err);
});

module.exports = app;
//# sourceMappingURL=index.js.map