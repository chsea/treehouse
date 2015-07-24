var Profile = require("./profile.js");
var renderer = require('./renderer.js');
var querystring = require('querystring');

var commonHeader = {'Content-Type': 'text/html'};

// Handle HTTP route GET / and POST / i.e. Home
function home(request, response) {
  if (request.url ==='/') {
    if (request.method.toLowerCase() === 'get') {
    //show search
      response.writeHead(200, commonHeader);
      renderer.view('header', {}, response);
      renderer.view('search', {}, response);
      renderer.view('footer', {}, response);
      response.end();
    } else {
      //if url == "/" && POST
      
      //get the post data from body
      request.on("data", function(postBody) {
        //extract the username
        var query = querystring.parse(postBody.toString());
        //redirect to /:username
        response.writeHead(303, {'location': '/' + query.username});
        response.end();
      });
    }
  }
}

//Handle HTTP route GET /:username i.e. /chalkers
function user(request, response) {
  var username = request.url.replace('/', '');
  if (username.length > 0) {
    response.writeHead(200, {'Content-Type': commonHeader});
    renderer.view('header', {}, response);;
    
    //get json from Treehouse
    var studentProfile = new Profile(username);
    //on "end"
    studentProfile.on("end", function(profileJSON) {
      var values = {
        avatarURL: profileJSON.gravatar_url,
        username: profileJSON.profile_name,
        badges: profileJSON.badges.length,
        javascriptPoints: profileJSON.points.JavaScript
      };
      
      renderer.view('profile', values, response);
      renderer.view('footer', {}, response);
      response.end();
    });
    
    //on "error"
    studentProfile.on("error", function(error) {
      renderer.view('error', {errorMessage: error.message}, response);
      renderer.view('search', {}, response);
      renderer.view('footer', {}, response);
      response.end();
    });
  }
}

module.exports.home = home;
module.exports.user = user;