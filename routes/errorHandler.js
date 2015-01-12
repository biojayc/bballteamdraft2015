var layout = require('../layout'),
    url = require('url');

var error = function(req, res) {
  var text = new layout.LayoutEngine("error.html").render();
  res.writeHead(404, {'Content-Type': 'text/html'});
  res.end(text);
}

exports.error = error;
