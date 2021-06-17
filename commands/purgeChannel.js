const Discord = require('discord.js');

module.exports = {
    name: "purgechannel",
    aliases: ["purge", "pc"],
    description: "Clone et supprime l'ancien salon afin de supprimer son contenu\nPropriétaire du serveur uniquement",
    guildOnly: true,
    ownerOnly: true,
    /**
     * 
     * @param {Discord.Message} message 
     * @param {*} args 
     */
    execute(message, args) {
        message.channel.clone({reason: `Purge du salon demandé par ${message.author.username}`});
        message.channel.delete(`Purge du salon demandé par ${message.author.username}`);
    }
};