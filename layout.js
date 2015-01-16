var fs = require("fs"),
    readline = require('readline'),
    url = require('url'), 
    CacheManager = require('./cache').CacheManager,
    log = require('./log');

var cache = new CacheManager();

function readFile(file) {
  return cache.get(file, function() {
    log.info("Loading " + file + " into cache.");
    //TODO get rid of sync method here.
    return fs.readFileSync(file, "utf8");
  }, 3600);
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

var substituteVars = function(html, vars) {
  var re = /##(\w+)##/;
  var done = false;
  while (!done) {
    var match = html.match(re);
    if (match) {
      var key = match[1];
      if (vars[key]) {
        html = html.replace("##" + key + '##', vars[key]);
      } else {
        html = html.replace("##" + key + '##', '');
      }
    } else  {
      done = true;
    }
  }
  return html;
}

var getRepeatedRegions = function(html) {
  var startRegex = /##(\w+)-begin##/;
  var result = [];
  var done = false;
  
  while (!done) {
    var match = html.match(startRegex);
    if (match) {
      var regionName = match[1];
      html = html.substr(html.search(startRegex) + regionName.length + 10, html.length);
      var endRegex = "##" + regionName + "-end##";
      var innerHTML = html.substr(0, html.search(endRegex));
      html = html.substr(html.search(endRegex), html.length);
      if (regionName && innerHTML) {
        result.push({ name: regionName, html: innerHTML });
      }
    } else {
      done = true;
    }
  }
  return result;
}

var processRepeatedRegions = function(html, vars) {
  var repeatedRegions = getRepeatedRegions(html);
  var newHTML;
  for(var i=0; i < repeatedRegions.length; i++) {
    var region = repeatedRegions[i];
    newHTML = "";
    var regionName = region.name;
    var regionHTML = region.html;
    var arr = vars[regionName] || [];
    for (var j=0;j < arr.length; j++) {
      var obj = arr[j];
      var tempHTML = processRepeatedRegions(regionHTML, obj);
      newHTML += substituteVars(tempHTML, obj);
    }
    var re = eval("/##" + regionName + "-begin##[.\\W\\w\\s\\r\\n]*" +
        "##" + regionName + "-end##/");
    html = html.replace(re, newHTML);
  }
  return html;
}

var LayoutEngine = function(bodyFile, layoutFile, vars) {
  this.bodyFile = bodyFile;
  this.layoutFile = layoutFile;
  this.vars = vars;
}
LayoutEngine.prototype.render = function() {
  var html = getLayoutText(this.bodyFile, this.layoutFile);
  
  html = processRepeatedRegions(html, this.vars);
  html = substituteVars(html, this.vars);
  return html;
}

exports.LayoutEngine = LayoutEngine;
