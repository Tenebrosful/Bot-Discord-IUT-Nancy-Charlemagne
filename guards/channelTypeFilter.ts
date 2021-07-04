import { CommandInteraction, DMChannel } from "discord.js";

export const notDMChannel = async (
    messageOrCommand: CommandInteraction,
    client,
    next
) => {
    if (messageOrCommand.channel || messageOrCommand.channel.type !== 'dm')
        await next();
    else
        messageOrCommand.reply({ content: "❌ Désolé mais je ne peux pas effectuer cette commande en message privé.", ephemeral: true });
};

export const notThreadChannel = async (
    messageOrCommand: CommandInteraction,
    client,
    next
) => {
    if (messageOrCommand.channel || !messageOrCommand.channel.isThread())
        await next();
    else
        messageOrCommand.reply({ content: "❌ Désolé mais je ne peux pas effectuer cette commande en Thread.", ephemeral: true });
};