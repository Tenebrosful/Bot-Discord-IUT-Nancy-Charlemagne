const Discord = require('discord.js');

module.exports = {
    name: 'ready',
    once: true,
    /**
     * 
     * @param {Discord.Client} client 
     */
    execute(client, config) {
        console.log('Ready');
        client.user.setPresence({status: 'idle', activity: {name: "Soon™ (Un jour peut être)", type: 'LISTENING'}})
    }
}