import { Client } from 'discordx';
import { Interaction, CommandInteraction } from "discord.js";

export function getHorodateConsole() {
    const date: Date = new Date(Date.now());

    return `[${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}]`
}

export function logInteraction(interaction: Interaction, client: Client) {
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
            //@ts-ignore
            log += `\t${Client.users.resolve(interaction.targetId)?.username}`;
        else if (interaction.targetType === "MESSAGE")
            //@ts-ignore
            log += `\t${Client.targetId}`;
    }

    return log;
}