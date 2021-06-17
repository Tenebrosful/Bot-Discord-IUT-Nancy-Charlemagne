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

        if (command.ownerOnly && message.author.id !== message.guild.ownerID) { message.lineReply("Seul le propriétaire du serveur peut effectuer cette commande."); return; }

        try {
            console.log(command.name, message.author.username);
            message.channel.startTyping();
            await command.execute(message, args, config);
            message.channel.stopTyping();
        } catch (error) {
            console.error(error);
            message.channel.send('<@853950214628835380> Vérifie la console car la commande vient de bugger :eyes:');
        }
    }
}