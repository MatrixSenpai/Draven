const strings = require('../include/strings').strings;

class MessageHandler {
    constructor(parse, logger) {
        this.logger = logger;
        this.parse = parse;
        this.parse.Config.get().then( (config) => { this.config = config; })

        this._runningPromises = {};
    }

    handle(message) {
        let commandChar = this._commandChar();

        if(message.content.charAt(0) == commandChar) {
            let split = message.content.split(" ");
            let command = split[0].slice(1);

            switch(command) {
                case "host"   : this._host(message, split); break;
                case "command": this._setCommandChar(message, split); break;
                case "issue"  : message.reply(strings.replies.issue); break;
                default: message.reply("hello bitch");
            }
        }
    }

    _host(message, split) {
        message.reply('Create a new tournament');

        let type = split[1];
        if(type === "inhouse") {

        } else if(type === "global") {

        } else {
            message.reply('please specify a type of tournament (`global` or `inhouse`');
        }
    }

    _setCommandChar(message, split) {
        if(!message.member.permissions.has('MANAGE_GUILD', true)) {
            this.logger.warn(`A user attempted to change the command char. Offender: ${message.author.tag}`)
            message.reply('you must have the "Manage Server" permission or be an admin to perform this action');
            return;
        }
        let newChar = split[1]
        if(newChar.length == 1) {
            this.parse.Config.save({command: newChar}).then((config) => {
                this.logger.info(`Command char updated: ${newChar}`)
                message.reply(`the command character has been updated to \`${newChar}\``);
                this.config = config;
            });
        } else {
            message.reply('please use a one-character command char. Preferably a special character. Ex: `. , ! $`')
        }
    }

    _commandChar() {
        let c = this.config.get('command');
        if(c == null || c == undefined) { return "."; }
        else { return c; }
    }
}

module.exports = MessageHandler;
