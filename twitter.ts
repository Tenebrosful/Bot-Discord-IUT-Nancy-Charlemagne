require('dotenv').config()
import { Client } from 'discord.js';
import * as fs from 'fs';
import * as Twit from 'twit';
import { getHorodateConsole, resetPresence } from './libs/util';

export let SingletonClient: Client;

async function start() {
    SingletonClient = new Client({ intents: ['GUILDS'] });

    loadTwitterEvents(new Twit({
        consumer_key: process.env.CONSUMER_KEY ?? "",
        consumer_secret: process.env.CONSUMER_SECRET ?? "",
        access_token: process.env.ACCESS_TOKEN ?? "",
        access_token_secret: process.env.ACCESS_TOKEN_SECRET ?? ""
    }), SingletonClient);

    SingletonClient.on("ready", () => {
        console.log(`${getHorodateConsole()}\tReady !`);

        if (SingletonClient.user)
            resetPresence(SingletonClient.user);
    })

    await SingletonClient.login(process.env.BETA_BOT_TOKEN ?? process.env.TWITTER_BOT_TOKEN ?? "");
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

function handleExit(signal: NodeJS.Signals) {
    console.info(`${getHorodateConsole()} Signal ${signal} reçu.`);
    SingletonClient.user?.setPresence({ status: "idle", activities: [{ name: "Arrêt en cours", type: "COMPETING" }] })
    SingletonClient.destroy();
    console.log(`${getHorodateConsole()} Arrêt du bot.`);
    process.exit(0);
}

start();

process.on("SIGINT", handleExit);
process.on("SIGTERM", handleExit);