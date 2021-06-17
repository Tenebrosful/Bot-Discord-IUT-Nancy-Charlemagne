const Discord = require('discord.js');

module.exports = {
    name: "forcelasttweet",
    aliases: ["flt"],
    description: "Force la prise en compte du dernier Tweet catch en cas de crash du bot Twitter\nPropriétaire du serveur uniquement",
    guildOnly: true,
    ownerOnly: true,
    /**
     * 
     * @param {Discord.Message} message 
     * @param {*} args 
     */
    execute(message, args) {

        const postTweet = require('../events/twitter/tweet.js');
        const tweet = require('../testData.json');

        postTweet.execute(tweet, message.client);

        message.delete({ reason: 'Suppression du message de la commande' });
    }
};