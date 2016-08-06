// Load necessary settings first
var nconf = require('nconf');
nconf.env().file({ file: '.env.json' });
var PORT  = nconf.get('PORT');
var TOKEN = nconf.get('TOKEN');
var isTesting = nconf.get('MODE')  === 'test';

var holy = require('./holy');
var Botkit = require('botkit');

if (!PORT)  { throw Error('Port missing but required');        }
if (!TOKEN) { throw Error('Slack token missing but required'); }

var controller = Botkit.slackbot(isTesting ? {
  debug: true,
  logLevel: 7,
} : {
  debug: false,
});

controller
  .setupWebserver(PORT, createWebhook)
  .on('slash_command', handleSlashCommand);

/******************************************************************************/

function createWebhook(err, webserver) {
  controller.createWebhookEndpoints(webserver);
}

function handleSlashCommand(bot, message) {
  switch (message.command) {
    case '/holy':
      var response = message.text ? ('Holy ' + message.text) : holy();
      bot.replyPublic(message, response + '!');
      break;
  }
}
