var restify = require('./restify'),
    mainHandler = require('./routes/mainHandler'),
    testHandler = require('./routes/testHandler'),
    errorHandler = require('./routes/errorHandler');

restify.startWebServer(1337);

restify.registerRoute("/", "*", mainHandler.home);
restify.registerRoute("/other.*", "GET", mainHandler.otherGet);
restify.registerRoute("/other.*", "POST", mainHandler.otherPost);
restify.registerRoute("/test.*", "GET", testHandler.main);
restify.registerRoute("404", "GET", errorHandler.error);

restify.registerStatic("/static.*");
