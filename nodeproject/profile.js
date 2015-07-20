var http = require("http");

function printMessage(username, badges, points) {
  var message = username + " has " + badges + " badge(s) and " + points + " total points.";
  console.log(message);
}

function printError(error) {
  console.error(error.message);
}

function get(username) {
  var request = http.get("http://teamtreehouse.com/" + username + ".json", function(response) {
    var body = "";

    if (response.statusCode === 200) {
      response.on("data", function(chunk) {
        body += chunk;
      });

      response.on("end", function() {
        try {
          var profile = JSON.parse(body);
          printMessage(username, profile.badges.length, profile.points.JavaScript);
        } catch(error) {
          printError(error);
        }
      });
    } else {
      printError({message: "There was an error getting the profile for " + username + ". (" + http.STATUS_CODES[response.statusCode] + ")"});
    }
  });

  request.on("error", printError);
}


module.exports.get = get;
