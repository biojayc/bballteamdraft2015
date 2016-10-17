var layout = require('../layout'),
    url = require('url');

var error = function(req, res) {
  layout.create("layouts/error.html").render(function(html) {
    res.writeHead(404, {'Content-Type': 'text/html'});
    res.end(html);	
  });
}

exports.error = error;
