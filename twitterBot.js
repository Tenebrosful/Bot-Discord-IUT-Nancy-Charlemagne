const fs = require('fs');
const Discord = require('discord.js');
require('discord-reply');
const Twit = require('twit');

const botConfig = require('./config/bot.json');
const twitterConfig = require('./config/twitter.json');

const client = new Discord.Client();

loadTwitterEvents(setupTwitter());

client.login(botConfig.bot_token);

console.log('Twitter Bot Ready');

function setupTwitter() {
    return new Twit(twitterConfig);
}

/**
 * 
 * @param {Twit} Twitter 
 */
function loadTwitterEvents(Twitter) {
    const eventFiles = fs.readdirSync('./events/twitter').filter(file => file.endsWith('.js'));

    for (const file of eventFiles) {
        const event = require(`./events/twitter/${file}`);
        let stream;

        try {
            stream = Twitter.stream(event.endPoint, event.options);
        } catch (err){
            console.log(err);
        }
        stream.on(event.name, (...args) => event.execute(...args, client));
    }
}