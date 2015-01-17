var restify = require('./restify'),
    mainHandler = require('./routes/mainHandler'),
    ownerHandler = require('./routes/ownerHandler'),
    gamesHandler = require('./routes/gamesHandler'),
    testHandler = require('./routes/testHandler'),
    errorHandler = require('./routes/errorHandler');

restify.startWebServer(1337);

restify.registerRoute("/", "*", mainHandler.home);
restify.registerRoute("/owner", "*", ownerHandler.home);
restify.registerRoute("/games", "*", gamesHandler.home);
restify.registerRoute("/other.*", "GET", testHandler.otherGet);
restify.registerRoute("/other.*", "POST", testHandler.otherPost);
restify.registerRoute("/test.*", "GET", testHandler.main);
restify.registerRoute("404", "GET", errorHandler.error);

restify.registerStatic("/static.*");
restify.registerStatic("/css.*", "/static/css");
restify.registerStatic("/images.*", "/static/images");
restify.registerStatic("/favicon.ico", "/static/images/favicon.ico");
