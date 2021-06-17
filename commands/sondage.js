const Discord = require('discord.js');

module.exports = {
    name: "sondage",
    aliases: ["vote"],
    description: "Créé un sondage",
    guildOnly: true,
    usage: "<message>",
    /**
     * 
     * @param {Discord.Message} message 
     * @param {string[]} args 
     */
    async execute(message, args) {
        if (args.length === 0) { message.lineReply("Désolé mais pour faire un sondage il faudrait indiquer un message ou une question :eyes:"); return; }
        
        const guild = message.guild;
        const channel = message.channel;
        const text = args.join(' ');

        const resEmbed = new Discord.MessageEmbed()
            .setColor("#DD131E")
            .setTitle(text)
            .setAuthor(message.author.username, message.author.avatarURL({ dynamic: true }))
            .setFooter("Tu peux voter en cliquant sur les réactions en dessous")
            .setTimestamp();

        const messageEmbed = await message.channel.send(resEmbed);
        message.delete({reason: 'Suppression du message de la commande'});

        await messageEmbed.react("👍");
        await messageEmbed.react("🤔");
        await messageEmbed.react("👎");
    }
};