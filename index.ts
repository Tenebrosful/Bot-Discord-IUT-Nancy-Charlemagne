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
        ]
    });

    SingletonClient.once("ready", async () => {
        try { await SingletonClient.initSlashes(); } catch (error) { console.log(error) }
        console.log('Ready !');
    });

    SingletonClient.on("interaction", (interaction) => {
        console.log(logInteraction(interaction));

        switch (interaction.type) {
            case 'APPLICATION_COMMAND':
                try { SingletonClient.executeSlash(interaction); } catch (error) { console.error(error) }
                break;
            case 'MESSAGE_COMPONENT':
                if (interaction.isButton) {
                    (<ButtonInteraction>interaction).reply({ content: "Peut être un jour, il y aura une fonction qui pourrait par exemple... remplacer les réactions pour obtenir un rôle en beaucoup plus propre, mais pour l'instant il n'y a rien.", ephemeral: true });
                } else {
                    (<MessageComponentInteraction>interaction).reply({ content: "Cette fonctionnalité n'a pas encore été implémenté, désolé :c", ephemeral: true });
                }

                break;
        }
    });

    await SingletonClient.login(config.bot_token);
}

export function getHorodateConsole() {
    const date: Date = new Date(Date.now());

    return `[${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}]`
}

function logInteraction(interaction: Interaction) {
    let log = `${getHorodateConsole()}\t${interaction.user.username}\t${interaction.type}`

    switch (interaction.type) {
        case 'APPLICATION_COMMAND':
            log += `\t${(<CommandInteraction>interaction).commandName}`;
            break;
        case 'MESSAGE_COMPONENT':
            if (interaction.isButton)
                log += `\t${(<ButtonInteraction>interaction).customID}`;
            break;
        case 'PING':
            break;
    }

    return log;
}

start();