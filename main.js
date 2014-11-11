var restify = require('./restify'),
    mainHandler = require('./routes/mainHandler'),
    errorHandler = require('./routes/errorHandler');

restify.startWebServer('127.0.0.1', 1337);

restify.registerRoute("/", "*", mainHandler.home);
restify.registerRoute("/other.*", "GET", mainHandler.otherGet);
restify.registerRoute("/other.*", "POST", mainHandler.otherPost);
restify.registerRoute("404", "GET", errorHandler.error);

restify.registerStatic("/static.*");
