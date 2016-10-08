var restify = require('./restify'),
    mainHandler = require('./routes/mainHandler'),
    loginHandler = require('./routes/loginHandler'),
    ownerHandler = require('./routes/ownerHandler'),
    gamesHandler = require('./routes/gamesHandler'),
    teamHandler = require('./routes/teamHandler'),
    conferenceHandler = require('./routes/conferenceHandler'),
    logsHandler = require('./routes/logsHandler'),
    testHandler = require('./routes/testHandler'),
    errorHandler = require('./routes/errorHandler'),
    shared = require('./routes/shared'),
    log = require('./log');

log.init();
shared.init();
logsHandler.init();

restify.startWebServer(1337);

restify.registerRoute("/", "GET", mainHandler.home);
restify.registerRoute("/login", "GET", loginHandler.home);
restify.registerRoute("/owner", "GET", ownerHandler.home);
restify.registerRoute("/games", "GET", gamesHandler.home);
restify.registerRoute("/team", "GET", teamHandler.home);
restify.registerRoute("/conference", "GET", conferenceHandler.home);
restify.registerRoute("/logs", "GET", logsHandler.home);
restify.registerRoute("404", "GET", errorHandler.error);

restify.registerStatic("/static.*");
restify.registerStatic("/css.*", "/static/css");
restify.registerStatic("/scripts.*", "/static/scripts");
restify.registerStatic("/images.*", "/static/images");
restify.registerStatic("/favicon.ico", "/static/images/favicon.ico");
