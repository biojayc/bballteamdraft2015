var timers = require('timers'),
    scores_querier = require('./scores_querier'),
    game_scraper = require('./game_scraper'),
    combiner = require('./combiner');

var oneMinute = 1000 * 60 * 1;

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