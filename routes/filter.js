var layout = require('../layout'),
    url = require('url'),
    requestUtils = require('../requestUtils'),
    qs = require('querystring'),
    shared = require('./shared'),
    sessionManager = require('../sessionManager');


var createGuid = (function() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
               .toString(16)
               .substring(1);
  }
  return function() {
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
           s4() + '-' + s4() + s4() + s4();
  };
})();


exports.filter = function(handler, req, res, s) {
  // If no sessionId (first time visiting site) generate one.
  if (!s.sessionId) {
    res.writeHead(302, {'Location': '/', 'Set-Cookie': 'SessionId=' + createGuid() + '; Expires=Wed, 1 Jan 2020 12:00:00 GMT'});
    res.end("");
    return;
  }
  var session = sessionManager.getSession(s.sessionId);
  // If we haven't logged in, redirect to login.
  if (!session.owner) {
    shared.redirectToLogin(res);
    return;
  }
  // If login is wrong (doesn't map to an owner) wipe, and redirect to login.
  if (shared.controller().ownersHash[session.owner] == null) {
    session.owner = null;
    shared.redirectToLogin(res);
  }
  // If we passed all checks, go ahead with page handler.
  handler(req, res, session);
}