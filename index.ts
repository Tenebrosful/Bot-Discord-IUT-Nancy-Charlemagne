import 'reflect-metadata';
import { Intents } from 'discord.js';
import { Client } from '@typeit/discord';
import * as config from './configs/bot.json';

async function start() {
    const client = new Client({
        intents: [
            Intents.ALL
        ],
        classes: [
            `${__dirname}/commands/*.ts`
        ],
        slashGuilds: ["753171392450527282"]
    });

    client.once("ready", async () => {
        await client.clearSlashes();
        await client.initSlashes();
    });

    client.on("interaction", (interaction) => {
        client.executeSlash(interaction);
    });

    await client.login(config.bot_token);

    console.log('Ready !');
}

start();