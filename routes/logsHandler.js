var layout = require('../layout'),
    url = require('url'),
    CacheManager = require('../cache').CacheManager,
    requestUtils = require('../requestUtils'),
    qs = require('querystring'),
    logs_processor = require('../logs_processor'),
    log = require('../log');

var cache = new CacheManager();
var init = function() {
  cache.add('processed_logs', function(callback) {
    log.info("Reloading processed logs.");
    logs_processor.process_logs('./logs/', function(logs) {
      callback(logs);
    }, 10 * 60 * 1000);  // ten minutes
  });
}

var home = function (req, res) {
  var requests = cache.get('processed_logs').slice();
  var vars = {
    requests: requests,
  };

  layout.create("layouts/logs_dashboard.html", undefined, vars).renderResponse(res);
}

exports.init = init;
exports.home = home;
