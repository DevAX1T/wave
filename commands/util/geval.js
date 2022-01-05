const {Command} = require('discord.js-commando');

module.exports = class GameEvalCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'geval',
			group: 'util',
			memberName: 'geval',
			description: 'Executes Lua code on any specified game servers.',
			details: 'Only the bot owner(s) may use this command.',
			ownerOnly: true,
            hidden: true,
			args: [
                {
                    key: 'server',
                    prompt: 'Which game server do you want to execute this code on?',
                    type: 'string',
                },
				{
					key: 'script',
					prompt: 'What code would you like to evaluate?',
					type: 'string',
				}
			]
		});

		this.lastResult = null;
		Object.defineProperty(this, '_sensitivePattern', { value: null, configurable: true });
	}
    run(msg, args) {
        // Remove any surrounding code blocks before evaluation
		if(args.script.startsWith('```') && args.script.endsWith('```')) {
			args.script = args.script.replace(/(^.*?\s)|(\n.*$)/g, '');
		}
        msg.reply('This command needs to be implemented.')
        msg.code('lua', args.script);
    }
};