var logs_processor = require('./logs_processor'),
    restify = require('../restify'),
    layout = require('../layout'),
    requestUtils = require('../requestUtils');

var processed_logs = logs_processor.process_logs('../logs/');

restify.startWebServer(1338);

restify.registerRoute("/", "GET", function(req, res) {
  var requests = processed_logs.slice();
  var vars = {
    requests: requests,
  };

  new layout.LayoutEngine('index.html',undefined, vars).render(function(html) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(html);
  });
});