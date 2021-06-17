import { ArgsOf, Guard, GuardFunction } from "@typeit/discord"
import { CommandInteraction } from "discord.js"

export const OwnerOnly = async (
    messageOrCommand: CommandInteraction,
    client,
    next
) => {
    if (messageOrCommand.user.id === messageOrCommand.guild.ownerID)
        await next();
    else
        messageOrCommand.reply(`❌ Désolé, seul le propriétaire du serveur peut effectuer cette commande !`);
};