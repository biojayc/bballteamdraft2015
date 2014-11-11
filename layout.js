var fs = require("fs"),
    readline = require('readline'),
    url = require('url');

var fileCache = {};

function readFile(file) {
  if (!fileCache[file]) {
    fileCache[file] = fs.readFileSync(file, "utf8");
  }
  return fileCache[file];
}

var getLayoutText = function(bodyFile, layoutFile) {
  var body = readFile("layouts/" + bodyFile);
  if (layoutFile && layoutFile != "") {
    var layout = readFile("layouts/" + layoutFile);
    var html = layout.replace("##BODYTEXT##", body);
  } else {
    var html = body;
  }
  
  return html;
}

var LayoutEngine = function(bodyFile, layoutFile, vars) {
  this.bodyFile = bodyFile;
  this.layoutFile = layoutFile;
  this.vars = vars;
}
LayoutEngine.prototype.Render = function() {
  var html = getLayoutText(this.bodyFile, this.layoutFile);
  for(var key in this.vars) {
    html = html.replace("##" + key + "##", this.vars[key]);
  }
  html = html.replace(/##\w+##/g,"");
  
  // Find repeated regions
  if (html.match(/##\w+-start+##/)) {
    console.log("have repeated region");
  }
  return html;
}

exports.LayoutEngine = LayoutEngine;
