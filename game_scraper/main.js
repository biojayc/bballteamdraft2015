var timers = require('timers'),
    scores_querier = require('./scores_querier'),
    game_scraper = require('./game_scraper'),
    combiner = require('./combiner');

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

// var needsToRun = true;
var oneMinute = 1000 * 60 * 1;
var tenMinutes = oneMinute * 10;

var run = function() {
  // var hours = new Date().getHours();
  // console.log("Woke up.  Hours: " + hours + "  NeedsToRun: " + (needsToRun ? 'true' : 'false'));
  // if (hours == 0) {
  //   if (needsToRun) {
  //    needsToRun = false;
      console.log(getDateString() + ": Running scores_querier");
      scores_querier.run();
      timers.setTimeout(function() {
        console.log(getDateString() + ": Running game_scraper");
        game_scraper.run();
        timers.setTimeout(function() {
          console.log(getDateString() + ": Running combiner");
          combiner.run();
        }, oneMinute);
      }, oneMinute);
  //   }
  // } else {
  //   needsToRun = true;
  // }
}

run();
timers.setInterval(run, tenMinutes); //every 30 minutes