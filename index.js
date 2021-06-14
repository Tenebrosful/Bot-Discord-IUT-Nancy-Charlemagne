const fs = require('fs');
const Discord = require('discord.js');
require('discord-reply');
const config = require('./config.json');

const client = new Discord.Client();

loadCommands();
loadEvents();
client.login(config.bot_token);

function loadEvents() {
    const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

    for (const file of eventFiles) {
        const event = require(`./events/${file}`);
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args, client, config));
        } else {
            client.on(event.name, (...args) => event.execute(...args, client, config));
        }
    }
}

function loadCommands() {
    config.commands = new Discord.Collection();

    const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const command = require(`./commands/${file}`);
        config.commands.set(command.name, command);
    }
}