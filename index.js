const fs = require('fs');
const Discord = require('discord.js');
require('discord-reply');

const botConfig = require('./config/bot.json');

const client = new Discord.Client();

loadCommands();
loadDiscordEvents();

client.login(botConfig.bot_token);

function loadDiscordEvents() {
    const eventFiles = fs.readdirSync('./events/discord').filter(file => file.endsWith('.js'));

    for (const file of eventFiles) {
        const event = require(`./events/discord/${file}`);
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args, client, botConfig));
        } else {
            client.on(event.name, (...args) => event.execute(...args, client, botConfig));
        }
    }
}

function loadCommands() {
    botConfig.commands = new Discord.Collection();

    const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const command = require(`./commands/${file}`);
        botConfig.commands.set(command.name, command);
    }
}