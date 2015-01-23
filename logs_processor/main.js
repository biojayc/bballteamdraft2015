var logs_processor = require('./logs_processor'),
    restify = require('../restify'),
    layout = require('../layout'),
    requestUtils = require('../requestUtils');

var processed_logs = logs_processor.process_logs('../logs/');

restify.startWebServer(1338);

restify.registerRoute("/", "GET", function(req, res) {
  var vars = {
    requests: processed_logs.requests,
  };

  new layout.LayoutEngine('index.html',undefined, vars).render(function(html) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(html);
  });
});

restify.registerRoute("/ip.*", "GET", function(req, res) {
  var ip;
  var queryObj = requestUtils.getQueryObj(req);
  if (queryObj && queryObj['ip']) {
    var ip = queryObj['ip'];
  }
  var vars = {
    requests: processed_logs.ipHash[ip],
  };

  new layout.LayoutEngine('index.html',undefined, vars).render(function(html) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(html);
  });
});