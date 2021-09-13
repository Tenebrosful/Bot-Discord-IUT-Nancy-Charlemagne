require('dotenv').config()
import { Client } from 'discord.js';
import * as fs from 'fs';
import * as Twit from 'twit';
import { getHorodateConsole } from './util';

async function start() {
    const client = new Client({ intents: ['GUILDS'] });

    loadTwitterEvents(new Twit({
        consumer_key: process.env.CONSUMER_KEY ?? "",
        consumer_secret: process.env.CONSUMER_SECRET ?? "",
        access_token: process.env.ACCESS_TOKEN ?? "",
        access_token_secret: process.env.ACCESS_TOKEN_SECRET ?? ""
    }), client);

    await client.login(process.env.BOT_TOKEN ?? "");

    console.log(`${getHorodateConsole()}\tReady !`);
}

function loadTwitterEvents(Twitter: Twit, client: Client) {
    const eventFiles = fs.readdirSync('./events/twitter').filter(file => file.endsWith('.ts'));

    for (const file of eventFiles) {
        const event = require(`./events/twitter/${file}`);
        let stream;

        try {
            stream = Twitter.stream(event.endPoint, event.options);
        } catch (err) {
            console.log(err);
        }

        if (!stream) { console.error(`[FAIL LOAD] ${file}, stream = ${stream}`); return; }

        stream.on(event.name, (...args) => event.execute(...args, client));
    }
}

start();