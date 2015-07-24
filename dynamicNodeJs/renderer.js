var fs = require('fs');

function mergevalues(values, content) {
  //cycle over keys
  for(var key in values) {
    //replace {{keys}} with values
    content = content.replace('{{' + key + '}}', values[key]);
  }

  //return merged content
  return content;
};

function view(templateName, values, response) {
  //read from the template file
  var fileContents = fs.readFileSync('./views/' + templateName + '.html', {encoding: 'utf8'});
  //insert values into to the template
  fileContents = mergevalues(values, fileContents);
  //write out response
  response.write(fileContents);
}

module.exports.view = view;