import { CommandInteraction } from "discord.js";

export const ownerOnly = async (
    messageOrCommand: CommandInteraction,
    client,
    next
) => {
    if (messageOrCommand.user.id === messageOrCommand.guild.ownerID)
        await next();
    else
        messageOrCommand.reply({ content: `❌ Désolé, seul le propriétaire du serveur peut effectuer cette action !`, ephemeral: true });
};