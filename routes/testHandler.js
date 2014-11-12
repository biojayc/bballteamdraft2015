var layout = require('../layout'),
    url = require('url'),
    requestUtils = require('../requestUtils'),
    qs = require('querystring');

var main = function(req, res) {
  // var query = requestUtils.getQueryObj(req);
  var test = "test";
  
  var obj = 
  {
      test: test, 
      region: [
          { 
              name: "hello",
              subregion: [
                  { name: "hello2" },
                  { name: "hello3" },
              ],
          },
          {
              name:"hi",
              subregion: [
                  { name: "hi2" },
                  { name: "hi3" },
              ],
          }
      ]
  };
  
  var text = new layout.LayoutEngine(
      "test.html", "layout.html", obj).Render();
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


exports.main = main;
exports.otherGet = otherGet;
exports.otherPost = otherPost;
