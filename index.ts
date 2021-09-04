import { Client } from 'discordx';
import { CommandInteraction, Intents, Interaction } from 'discord.js';
import 'reflect-metadata';

import * as bot from './config/bot.json';

export let SingletonClient: Client;

async function start() {
    SingletonClient = new Client({
        intents: [
            Intents.FLAGS.GUILDS,
            Intents.FLAGS.GUILD_MESSAGES,
            Intents.FLAGS.GUILD_VOICE_STATES,
            Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
            Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
            Intents.FLAGS.DIRECT_MESSAGES,
            Intents.FLAGS.DIRECT_MESSAGE_TYPING,
            Intents.FLAGS.GUILD_INTEGRATIONS,
            Intents.FLAGS.GUILD_PRESENCES,
            Intents.FLAGS.GUILD_WEBHOOKS,
            Intents.FLAGS.GUILD_MEMBERS,
            Intents.FLAGS.GUILD_INVITES,
            Intents.FLAGS.GUILD_BANS,
        ],
        classes: [
            `${__dirname}/commands/*.ts`,
            `${__dirname}/events/discord/*.ts`
        ],
        botId: "850109914827587605",
        requiredByDefault: false
    });

    SingletonClient.once("ready", async () => {
        await SingletonClient.initApplicationCommands();
        console.log("Ready !");
    });

    SingletonClient.on("interactionCreate", (interaction) => {
        SingletonClient.executeInteraction(interaction);
    });

    SingletonClient.login(bot.token ?? "");
}

start();