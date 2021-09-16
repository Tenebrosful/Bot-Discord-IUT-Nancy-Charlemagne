require('dotenv').config()
import { Intents } from 'discord.js';
import { Client } from 'discordx';
import 'reflect-metadata';
import { getHorodateConsole, logInteraction, resetPresence } from './util';

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
            `${__dirname}/global/*/*.ts`,
            `${__dirname}/global/events/discord/*.ts`,
            `${__dirname}/iut_nc_depinfo/*/*.ts`,
            `${__dirname}/iut_nc_depinfo/events/discord/*.ts`
        ],
        botId: "850109914827587605"
    });

    SingletonClient.once("ready", async () => {
        await SingletonClient.initApplicationCommands();
        console.log(`${getHorodateConsole()}\tReady !`);

        if (SingletonClient.user)
            resetPresence(SingletonClient.user);
    });

    SingletonClient.on("interactionCreate", (interaction) => {
        console.log(logInteraction(interaction, SingletonClient));
        SingletonClient.executeInteraction(interaction);
    });

    SingletonClient.login(process.env.BETA_BOT_TOKEN ?? process.env.MAIN_BOT_TOKEN ?? "");
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