const express     = require('express');
const ParseServer = require('parse-server').ParseServer;
const Parse       = require('parse/node');
const Discord     = require('discord.js');
const log         = require('tracer');
const fs          = require('fs');

const handler     = require('./bin/handler');
const tokens      = require('./include/tokens').tokens;

const client  = new Discord.Client();
const app     = express();
const Logger  = log.colorConsole({
    transport: [
        function(data) {
            fs.appendFile(__dirname + '/logs/draven.output.log', data.rawoutput + '\n', (e) => { if(e) throw e; });
        },
        function(data) {
            console.log(data.output);
        }
    ]
})

// PARSE SERVER
var api = new ParseServer({
    databaseURI  : tokens.parse.mongourl,
    appId        : tokens.parse.appid,
    masterKey    : tokens.parse.master,
    javaScriptKey: tokens.parse.js,
    serverURL    : tokens.parse.serverurl,
    verbose      : false
});
app.use('/parse', api);

app.listen(1337, () => { console.log('Parse server now running on 1337.')} );

// PARSE CLIENT
Parse.initialize(tokens.parse.appid, tokens.parse.js, tokens.parse.master);
Parse.serverURL = tokens.parse.serverurl;

const MessageHandler = new handler(Parse, Logger);

client.on('ready', () => { Logger.info(`Logged in: ${client.user.tag}`)});
client.on('message', (m) => { MessageHandler.handle(m); });
client.login(tokens.discord);
