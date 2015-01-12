var getDateString = function() {
  var newDate = new Date();
  
  var dd = newDate.getDate();
  var MM = newDate.getMonth()+1; //January is 0!
  var yyyy = newDate.getFullYear();
  var hh = newDate.getHours();
  var mm = newDate.getMinutes();
  var ss = newDate.getSeconds();
  var ms = newDate.getMilliseconds();

  if(dd<10) {
    dd='0'+dd
  } 

  if(MM<10) {
    MM='0'+MM
  } 

  return MM+'/'+dd+'/'+yyyy + ":" + hh + ":" + mm + ":" + ss + ":" + ms;
}

var info = function(msg, sessionId) {
  log("I", msg, sessionId);
}

var error = function(msg, sessionId) {
  log("E", msg, sessionId);
}

var log = function(type, msg, sessionId) {
  var time = getDateString();

  var prefix = type + " " + time;
  if(sessionId) {
    prefix += " (" + sessionId + ")";
  }
  console.log(prefix + ": " + msg);
}

exports.info = info;
exports.error = error;