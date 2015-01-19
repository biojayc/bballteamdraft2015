var restify = require('./restify'),
    mainHandler = require('./routes/mainHandler'),
    ownerHandler = require('./routes/ownerHandler'),
    gamesHandler = require('./routes/gamesHandler'),
    testHandler = require('./routes/testHandler'),
    errorHandler = require('./routes/errorHandler'),
    shared = require('./routes/shared'),
    log = require('./log');

log.init();
shared.init();

restify.startWebServer(1337);

restify.registerRoute("/", "GET", mainHandler.home);
restify.registerRoute("/owner", "GET", ownerHandler.home);
restify.registerRoute("/games", "GET", gamesHandler.home);
// restify.registerRoute("/other.*", "GET", testHandler.otherGet);
// restify.registerRoute("/other.*", "POST", testHandler.otherPost);
// restify.registerRoute("/test.*", "GET", testHandler.main);
restify.registerRoute("404", "GET", errorHandler.error);

restify.registerStatic("/static.*");
restify.registerStatic("/css.*", "/static/css");
restify.registerStatic("/images.*", "/static/images");
restify.registerStatic("/favicon.ico", "/static/images/favicon.ico");
