const Discord = require('discord.js');

module.exports = {
    name: "help",
    aliases: ["aide", "h", "?"],
    description: "Affiche la liste des commandes disponibles",
    category: "category",
    usage: "[commande]",
    /**
     * 
     * @param {Discord.Message} message 
     * @param {string[]} args 
     * @param {*} config
     */
    execute(message, args, config) {
        const { commands, prefix } = config;
        const resEmbed = new Discord.MessageEmbed()
            .setColor('#DD131E')
            .setTimestamp();

        if (!args.length) {
            resEmbed.setTitle('Liste des commandes disponibles');
            resEmbed.setDescription(commands.map(cmd => cmd.name).sort().join(', '));
            resEmbed.setFooter(`Tu peux utiliser ces commandes avec le préfixe ${prefix}`);
        } else {
            const commandName = args[0].toLowerCase();
            const command = commands.get(commandName) || commands.find(c => c.aliases && c.aliases.includes(commandName));

            if (!command) { return message.lineReply("Cette commande n'existe pas"); return; }

            resEmbed.setTitle(command.name);

            if (command.aliases) resEmbed.addField('Aliases', command.aliases.join(', '), true);
            if (command.description) resEmbed.setDescription(command.description);
            if (command.usage) resEmbed.addField('Syntaxe', `\`${prefix}${command.name} ${command.usage}\``, true);
            if (command.cooldown) resEmbed.addField('Cooldown', `${command.cooldown} secondes`, true);
        }

        message.channel.send(resEmbed);
        message.delete({ reason: 'Suppression du message de la commande' });
    },
};