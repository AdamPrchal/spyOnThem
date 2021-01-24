const createError = require('http-errors');
const cookieParser = require('cookie-parser');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const nunjucks = require('nunjucks');

const indexRouter = require('./routes/index');
const personRouter = require('./routes/person');
const locationRouter = require('./routes/location');
const meetingRouter = require('./routes/meeting');
const relationRouter = require('./routes/relation');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'njk');

nunjucks.configure('views', {
    autoescape: true,
    express: app
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/static', express.static(path.join(__dirname, 'public')))

app.use('/', indexRouter);
app.use('/person', personRouter);
app.use('/location', locationRouter);
app.use('/meeting', meetingRouter);
app.use('/relation', relationRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createError(404));
  });
  
  // error handler
  app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    // render the error page
    res.status(err.status || 500);
    res.render('error', {err: err});
  });

const server = app.listen(3000, () => {
  console.log(`Express is running on port ${server.address().port}`);
});

module.exports = app;
