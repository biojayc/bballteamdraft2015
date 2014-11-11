var layout = require('../layout'),
    url = require('url'),
    requestUtils = require('../requestUtils'),
    qs = require('querystring');

var home = function(req, res) {
  var query = requestUtils.getQueryObj(req);
  var name = "Bob";
  if (query && query.name) {
    name = query.name;
  }
  var text = new layout.LayoutEngine(
      "index.html", "layout.html", { name: name }).Render();
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end(text);
}

var otherGet = function(req, res) {
  var text = new layout.LayoutEngine("other.html", "layout.html", {}).Render();
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end(text);
}

var otherPost = function(req, res) {
  requestUtils.getPostObj(req, function(body) {
    var title = "Thanks " + body.name + " age " + body.age;
    var text = new layout.LayoutEngine("generic.html", "layout.html",
        { title: title, body: "Thanks for posting."}).Render();
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(text);
  });
}

exports.home = home;
exports.otherGet = otherGet;
exports.otherPost = otherPost;
