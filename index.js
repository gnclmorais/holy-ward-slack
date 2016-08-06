var nconf = require('nconf');
nconf.env().file({ file: '.env' });
var PORT = nconf.get('PORT');
var TOKEN = nconf.get('TOKEN');

var holy = require('./holy');

var Slapp = require('slapp');
var ConvoStore = require('slapp-convo-beepboop');
var BeepBoopContext = require('slapp-context-beepboop');

var Botkit = require('botkit');

if (!PORT) {
  throw Error('Port missing but required');
}
if (!TOKEN) {
  throw Error('Slack Token missing but required');
}

var controller = Botkit.slackbot({ debug: true });
var bot = controller.spawn({ token: TOKEN }).startRTM();

controller.setupWebserver(PORT, function (err, webserver) {
  controller.createWebhookEndpoints(webserver);
});

controller.on('slash_command', function (bot, message) {
  if (message.command === '/holy') {
    var response = message.text ? ('Holy ' + message.text) : holy();

    bot.replyPublic(message, response);
  }
});












// var slapp = Slapp({
//   verify_token: process.env.SLACK,
//   convo_store: ConvoStore(),
//   context: BeepBoopContext(),
//   log: true,
//   colors: true,
// })

// /** Registe the slash command `/holy` */
// slapp.command('/holy', /^in/, function (msg) {
//   // `respond` is used for actions or commands and uses the `response_url` provided by the
//   // incoming request from Slack
// });
