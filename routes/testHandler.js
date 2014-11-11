var layout = require('../layout'),
    url = require('url'),
    requestUtils = require('../requestUtils'),
    qs = require('querystring');

var main = function(req, res) {
  // var query = requestUtils.getQueryObj(req);
  var test = "test";
  
  var obj = { test: test, region: [{ name: "hello" }, {name:"hi" } ] };
  
  var text = new layout.LayoutEngine(
      "test.html", "layout.html", obj).Render();
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end(text);
}

exports.main = main;
