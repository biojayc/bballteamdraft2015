var logs_processor = require('./logs_processor'),
    restify = require('../restify'),
    layout = require('../layout'),
    requestUtils = require('../requestUtils');

var processed_logs = logs_processor.process_logs('../logs/');

restify.startWebServer(1338);

restify.registerRoute("/", "GET", function(req, res) {
  var queryObj = requestUtils.getQueryObj(req);
  if (queryObj) {
    if (queryObj['filter']) {
      var filter = queryObj['filter'];
    }
    if (queryObj['ip']) {
      var ip = queryObj['ip'];
    } 
  }
  if (ip) {
    var requests = processed_logs.ipHash[ip].slice();
  } else {
    var requests = processed_logs.requests.slice();
  }
  if (filter == "static") {
    for (var i = 0; i < requests.length;i++) {
      var request = requests[i];
      if (request.url.indexOf('/static')== 0 ||
          request.url.indexOf('/css') == 0 ||
          request.url.indexOf('/images') == 0 ||
          request.url.indexOf('/favicon.ico') == 0) {
        requests.splice(i, 1);
        i--;
      }
    }
  }
  var vars = {
    requests: requests,
  };

  new layout.LayoutEngine('index.html',undefined, vars).render(function(html) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(html);
  });
});