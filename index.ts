import 'reflect-metadata';
import { Intents } from 'discord.js';
import { Client } from '@typeit/discord';
import * as config from './configs/bot.json';
import { Server } from './enums/IDs';

async function start() {
    const client = new Client({
        intents: [
            Intents.ALL
        ],
        classes: [
            `${__dirname}/commands/*.ts`
        ],
        slashGuilds: [Server.MAIN]
    });

    client.once("ready", async () => {
        await client.clearSlashes();
        await client.clearSlashes(Server.MAIN);
        await client.initSlashes();
        console.log('Ready !');
    });

    client.on("interaction", (interaction) => {
        try { client.executeSlash(interaction); } catch(error) { console.error(error) }
        
    });

    await client.login(config.bot_token);
}

start();