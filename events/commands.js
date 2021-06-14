const Discord = require('discord.js');

module.exports = {
    name: 'message',
    once: false,
    /**
     * 
     * @param {Discord.Message} message 
     * @param {Discord.Client} client 
     * @param {*} config 
     * @returns 
     */
    async execute(message, client, config) {
        if (!message.content.startsWith(config.prefix) || message.author.bot) return;

        const args = message.content.slice(config.prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        const command = config.commands.get(commandName)
            || config.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

        if (!command) return;

        try {
            await command.execute(message, args);
            message.delete();
        } catch (error) {
            console.error(error);
            message.reply('there was an error trying to execute that command!');
        }
    }
}