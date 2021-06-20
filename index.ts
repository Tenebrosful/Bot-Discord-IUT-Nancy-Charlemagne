import 'reflect-metadata';
import { Intents } from 'discord.js';
import { Client } from '@typeit/discord';
import * as config from './configs/bot.json';
import { Server } from './enums/IDs';

export let SingletonClient: Client;

async function start() {
    SingletonClient = new Client({
        intents: [
            Intents.ALL
        ],
        classes: [
            `${__dirname}/commands/*.ts`,
            `${__dirname}/events/discord/*.ts`
        ]
    });

    SingletonClient.once("ready", async () => {
        try { await SingletonClient.initSlashes(); } catch (error) { console.log(error) }
        console.log('Ready !');
    });

        try { client.executeSlash(interaction); } catch(error) { console.error(error) }
        
    SingletonClient.on("interaction", (interaction) => {
    });

    await SingletonClient.login(config.bot_token);
}

start();