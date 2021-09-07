require('dotenv').config()
import { Client } from 'discordx';
import { CommandInteraction, Intents, Interaction } from 'discord.js';
import 'reflect-metadata';

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
        console.log(logInteraction(interaction));
        SingletonClient.executeInteraction(interaction);
    });

    SingletonClient.login(process.env.BOT_TOKEN ?? "");
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
        log += `\t${interaction.customId}`;

        if (interaction.isSelectMenu())
            log += `\t${interaction.values}`;
    }

    if (interaction.isContextMenu()) {
        if (interaction.targetType === "USER")
            log += `\t${SingletonClient.users.resolve(interaction.targetId)?.username}`;
        else if (interaction.targetType === "MESSAGE")
            log += `\t${interaction.targetId}`;
    }

    return log;
}

start();