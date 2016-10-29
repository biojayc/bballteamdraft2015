var restify = require('./restify'),
    mainHandler = require('./routes/mainHandler'),
    loginHandler = require('./routes/loginHandler'),
    ownerHandler = require('./routes/ownerHandler'),
    teamHandler = require('./routes/teamHandler'),
    conferenceHandler = require('./routes/conferenceHandler'),
    challengeHandler = require('./routes/challengeHandler'),
    logsHandler = require('./routes/logsHandler'),
    testHandler = require('./routes/testHandler'),
    errorHandler = require('./routes/errorHandler'),
    shared = require('./routes/shared'),
    filter = require('./routes/filter'),
    sessionManager = require('./sessionManager'),
    log = require('./log');

log.init();
shared.init();
sessionManager.init("./data/sessions");
logsHandler.init();

restify.startWebServer(1337);
restify.registerFilter(filter.filter);
restify.registerRoute("/", "GET", mainHandler.home);
restify.registerRoute("/teamstandings", "GET", mainHandler.teamstandings);
restify.registerRoute("/games", "GET", mainHandler.games);
restify.registerRoute("/login", "GET", loginHandler.login, true); // skip filter
restify.registerRoute("/login", "POST", loginHandler.loginPOST, true); // skip filter
restify.registerRoute("/logout", "GET", loginHandler.logout);
restify.registerRoute("/owner", "GET", ownerHandler.home);
restify.registerRoute("/team", "GET", teamHandler.home);
restify.registerRoute("/conference", "GET", conferenceHandler.home);
restify.registerRoute("/challenges", "GET", challengeHandler.main);
restify.registerRoute("/challenge", "GET", challengeHandler.createChallenge);
restify.registerRoute("/challenge", "POST", challengeHandler.createChallengePOST);
restify.registerRoute("/challenges", "POST", challengeHandler.acceptChallengePOST);
restify.registerRoute("/logs", "GET", logsHandler.home);
restify.registerRoute("404", "GET", errorHandler.error);

restify.registerStatic("/static.*");
restify.registerStatic("/css.*", "/static/css");
restify.registerStatic("/scripts.*", "/static/scripts");
restify.registerStatic("/images.*", "/static/images");
restify.registerStatic("/favicon.ico", "/static/images/favicon.ico");
