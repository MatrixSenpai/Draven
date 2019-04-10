const express     = require('express');
const ParseServer = require('parse-server').ParseServer;
const Parse       = require('parse/node');
const Discord     = require('discord.js');
const log         = require('tracer');
const fs          = require('fs');

const handler     = require('./bin/handler');

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
    databaseURI  : 'mongodb://localhost:27017/parse',
    appId        : 'draven',
    masterKey    : 'draven-master',
    javaScriptKey: 'draven-js',
    serverURL    : 'http://localhost:1337/parse',
    verbose      : false
});
app.use('/parse', api);

app.listen(1337, () => { console.log('Parse server now running on 1337.')} );

// PARSE CLIENT
Parse.initialize("draven", 'draven-js', 'draven-master');
Parse.serverURL = 'http://localhost:1337/parse';

const MessageHandler = new handler(Parse, Logger);

client.on('ready', () => { Logger.info(`Logged in: ${client.user.tag}`)});
client.on('message', (m) => { MessageHandler.handle(m); });
client.login('NTU2NTMwNzgwMzU3MTMyMjk4.XK2Xnw.ZfjFq4IHTGHFYrt2KLfXb3XpV0I');
