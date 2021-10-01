console.log("hello!");

var getSubtitles = require('youtube-captions-scraper').getSubtitles;

console.log("hello!");
getSubtitles({
  videoID: 'ebDYuyomWEw', // youtube video id
  lang: 'en' // default: `en`
}).then(function(captions) {
  console.log(captions);
});
