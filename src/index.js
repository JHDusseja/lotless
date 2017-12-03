var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');
var multer = require('multer');
import {getConnection} from './database';
import {itemsrouter} from './routes/items';
import {shelvesrouter} from './routes/shelves';
import {imagesrouter} from './routes/images';
import {activitiesrouter} from './routes/activities';
import {checkoutrouter} from './routes/checkout';
import {findDiff} from "./routes/resemble";

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, 'public', 'images'))
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + '.jpg')
    }
});

// var upload = multer({ dest: path.join(__dirname, 'public', 'images') });
var upload = multer({ storage: storage });

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
app.use('/items', itemsrouter);
app.use('/shelves', shelvesrouter);
app.use('/images', upload.single('img'), imagesrouter);
app.use('/activities', upload.single('img'), activitiesrouter);
app.use('/checkout', upload.single('img'), checkoutrouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

// app.listen(port, function (req, res) {
//     console.log(`Listening on port: ${port}`);
// });

getConnection().then(function (connection) {
    connection.release();
    // let server = http.createServer(app);
    // server.listen(port, function (req, res) {
    //     console.log(`Listening on port: ${port}`);
    // });
    // console.log(diff);
    app.listen(port, function (req, res) {
        console.log(`Listening on port: ${port}`);
    });
}).catch(function (err) {
    console.log(err);
});

module.exports = app;