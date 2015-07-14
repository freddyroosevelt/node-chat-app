var express = require('express'),
    app = express(),
    path = require('path'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    config = require('./config/config.js'),
    ConnectMongo = require('connect-mongo')(session),
    mongoose = require('mongoose').connect(config.dbURL),
    passport = require('passport'),
    FacebookStrategy = require('passport-facebook').Strategy,
    rooms = []
    

// Tell express where to find all the html files
app.set('views', path.join(__dirname, 'views'));
//use hogan to render html files
app.engine('html', require('hogan-express'));
app.set('view engine', 'html');
// Find root folder and Static files - images CSS
app.use(express.static(path.join(__dirname, 'public')));
// Session to persist data between multpy pages
app.use(cookieParser());


// If statement to run server/app in dev mode or produc mode
var env = process.env.NODE_ENV || 'development';
if(env === 'development') {
    // Dev Settings
    app.use(session({secret: config.sessionSecret}));
}else {
    // Production Settings || Store on Mongodb - ConnectMongo
    app.use(session({
        secret:config.sessionSecret,
        store: new ConnectMongo({
            //url:config.dbURL,
            mongoose_connection:mongoose.connections[0],
            stringify:true
        })
    }));
}


// Activate Passport
app.use(passport.initialize());
app.use(passport.session());

// Auth for Passport
require('./auth/passportAuth.js')(passport, FacebookStrategy, config, mongoose);

// Call the routes module
require('./routes/routes.js')(express, app, passport, config, rooms);


// Used before Socket.io is implemented
/*app.listen(3000, function(){
    console.log('Chat server running on Port 3000');
    console.log('Mode:' + env);
});*/

// Socket.io - ^^^^ replaces code above
app.set('port', process.env.PORT || 3000);
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
require('./socket/socket.js')(io, rooms);

server.listen(app.get('port'), function() {
    console.log('App Server running on Port: ' + app.get('port'));
});
