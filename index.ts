import 'reflect-metadata';
import { ButtonInteraction, CommandInteraction, DiscordAPIError, Intents, Interaction, MessageComponentInteraction, TextChannel } from 'discord.js';
import { Client } from '@typeit/discord';
import * as config from './configs/bot.json';

export let SingletonClient: Client;

async function start() {
    SingletonClient = new Client({
        intents: [
            Intents.ALL
        ],
        classes: [
            `${__dirname}/commands/*.ts`,
            `${__dirname}/events/discord/*.ts`
        ],
        botId: "850109914827587605",
        requiredByDefault: false
    });

    SingletonClient.once("ready", async () => {
        try { await SingletonClient.initSlashes(); } catch (error) { console.log(error) }
        console.log('Ready !');
    });

    SingletonClient.on("interaction", (interaction) => {
        console.log(logInteraction(interaction));
        SingletonClient.executeSlash(interaction);
    });

    await SingletonClient.login(config.bot_token);
}

export function getHorodateConsole() {
    const date: Date = new Date(Date.now());

    return `[${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}]`
}

function logInteraction(interaction: Interaction) {
    let log = `${getHorodateConsole()}\t${interaction.user.username}\t${interaction.type}`

    if (interaction.isCommand())
        log += `\t${(<CommandInteraction>interaction).commandName}`;

    if (interaction.isMessageComponent()) {
        log += `\t${interaction.customID}`;

        if (interaction.isSelectMenu())
            log += `\t${interaction.values}`;
    }

    return log;
}

start();