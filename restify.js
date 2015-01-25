var fs = require("fs"),
    http = require('http'),
    url = require('url'),
    zlib = require('zlib'),
    log = require('./log');

var routes = [];
var errorHandler;

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

var Session = function() {
  this.requestId = createGuid();
}

var handleRequest = function(req, res) {
  var session = new Session();
  var path = url.parse(req.url).pathname;
  log.info("Incoming Request for: " + req.method + " " + path, session.requestId);
  log.info("User-agent: " + req.headers['user-agent'], session.requestId);
  log.info("IPAddress: " + req.connection.remoteAddress, session.requestId);
  var handler = findRoute(path, req.method, session);
  handler(req, res, session);
}

var findRoute = function(path, method, session) {
  for (var i = 0; i < routes.length; i++) {
    if (path.match("^" + routes[i].route + "$") && 
        (method == routes[i].method || routes[i].method == "*")) {
      log.info("Route found: " + routes[i].method + " " + routes[i].route, session.requestId);
      return routes[i].handler;
    }
  }
  if (errorHandler) {
    log.info("No Route found, returning 404 error handler", session.requestId);
    return errorHandler;
  }

  // If 404 and no 404 handler.
  return function(req, res) {
    log.info("No Route found, and no 404 handler.  Returning default error handler.", session.requestId);
    res.writeHead(404, {'Content-Type': 'text/html'});
    res.end("Sorry, the page you are looking for doesn't exist.");
  }
}

var returnError = function(req, res, session) {
  if (errorHandler) {
    errorHandler(req, res, session);
  } else {
    res.writeHead(404);
    res.end();
  }
}

var startWebServer = function(port, ip) {
  var server = http.createServer(handleRequest);
  if (ip) {
    server.listen(port, ip);
    log.info("Webserver running on " + ip + ":" + port);
  } else {
    server.listen(port);
    log.info("Webserver running on port " + port);
  }
}

var registerRoute = function(route, method, handler) {
  log.info("Registering Route: " + method + " " + route);
  if (route == "404") {
    errorHandler = handler;
  } else {
    routes.push({ route: route, method: method, handler: handler });
  }
}

var registerStatic = function(path, realpath) {
  log.info("Registering static path: " + path);
  routes.push({ 
    route: path, 
    method: "GET", 
    handler: function(req, res, session) {
      var filename = req.url;
      if (realpath) {
        filename = filename.replace(path.replace(".*", ""), realpath);
      }
      
      fs.exists('.' + filename, function(exists) {
        if (exists) {
          log.info("Returning " + filename, session.requestId);
          var raw = fs.createReadStream("." + filename);
          raw.on('error', function(err) {
            returnError(req, res, session);
          });
          var acceptEncoding = req.headers['accept-encoding'];
          if (!acceptEncoding) {
            acceptEncoding = '';
          }
          var contentType = 'text/html';
          if (filename.indexOf('.js') === filename.length - 3) {
            contentType = 'application/javascript';
          } else if (filename.indexOf('.png') === filename.length - 4) {
            contentType = 'image/png';
          } else if (filename.indexOf('.jpg') === filename.length - 4) {
            contentType = 'image/jpeg';
          } else if (filename.indexOf('.css') === filename.length - 4) {
            contentType = 'text/css';
          }
          if (acceptEncoding.match(/\bdeflat\b/)) {
            res.writeHead(200, { 'content-encoding': 'deflate', 'Content-Type': contentType });
            raw.pipe(zlib.createDeflate()).pipe(res);
          } else if (acceptEncoding.match(/\bgzip\b/)) {
            res.writeHead(200, { 'content-encoding' : 'gzip', 'Content-Type': contentType });
            raw.pipe(zlib.createGzip()).pipe(res);
          } else {
            res.writeHead(200, { 'Content-Type': contentType });
            raw.pipe(res);
          }
        } else {
          log.info(filename + ' not found.');
          returnError(req, res, session);
        }
      });
    }
  });
}

exports.startWebServer = startWebServer;
exports.registerRoute = registerRoute;
exports.registerStatic = registerStatic;
