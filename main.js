var restify = require('./restify'),
    mainHandler = require('./routes/mainHandler'),
    testHandler = require('./routes/testHandler'),
    errorHandler = require('./routes/errorHandler');

restify.startWebServer(1337);

restify.registerRoute("/", "*", mainHandler.home);
restify.registerRoute("/other.*", "GET", testHandler.otherGet);
restify.registerRoute("/other.*", "POST", testHandler.otherPost);
restify.registerRoute("/test.*", "GET", testHandler.main);
restify.registerRoute("404", "GET", errorHandler.error);

restify.registerStatic("/static.*");
