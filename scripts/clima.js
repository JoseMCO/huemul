// Description:
//   Obtiene info del clima desde donde el usuario haga la consulta, la manda a Wttr.in y muestra el resultado en Slack.
//
//  Dependencies:
//    cheerio
//    string
//
// Commands:
//   hubot clima <ciudad> | default: Santiago
//
// Author:
//   @jorgeepunan

var cheerio = require('cheerio');
var S       = require('string');

module.exports = function(robot) {
  robot.respond(/clima\s?(.*)/i, function(msg) {

    var ciudad = msg.match[1];
    var suffix = '?m';

    if( !ciudad.length ) {
      ciudad = 'Santiago' + suffix;
    } else {
      ciudad = ciudad + suffix;
    }

    var url = 'http://wttr.in/' + ciudad;

    robot.http(url).get()(function(err, res, body) {
      var $ = cheerio.load(body);
      if (res.statusCode !== 200 || body === 'ERROR') {
        return msg.reply('ocurrió un error con la búsqueda');
      }
      cleanText = S( $('pre').text() ).stripTags().s;
      msg.send( '```' + cleanText.split('┌')[0] + '```' ); // split por el primer resultado para no mostrar todo sino seguro se desarma en Slack Mobile App.

    });

  });
};
