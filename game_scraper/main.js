var timers = require('timers'),
    scores_querier = require('./scores_querier'),
    game_scraper = require('./game_scraper'),
    combiner = require('./combiner');

var needsToRun = true;
var oneMinute = 1000 * 60 * 1;
var tenMinutes = oneMinute * 10;

var run = function() {
  var hours = new Date().getHours();
  console.log("Woke up.  Hours: " + hours + "  NeedsToRun: " + (needsToRun ? 'true' : 'false'));
  if (hours == 0) {
    if (needsToRun) {
      needsToRun = false;
      console.log("Running scores_querier");
      scores_querier.run();
      timers.setTimeout(function() {
        console.log("Running game_scraper");
        game_scraper.run();
        timers.setTimeout(function() {
          console.log("Running combiner");
          combiner.run();
        }, oneMinute);
      }, oneMinute);
    }
  } else {
    needsToRun = true;
  }
}

// run();
timers.setInterval(run, tenMinutes); //every 10 minutes