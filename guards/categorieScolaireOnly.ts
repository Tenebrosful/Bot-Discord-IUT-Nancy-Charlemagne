import { CommandInteraction, TextChannel } from "discord.js"
import { ListCategorieScolaire } from "../enums/IDs";

export const categorieScolaireOnly = async (
    messageOrCommand: CommandInteraction,
    client,
    next
) => {
    if (ListCategorieScolaire.includes((<TextChannel>messageOrCommand.channel).parentID))
        await next();
    else
        messageOrCommand.reply({ content: `❌ Désolé, cette commande ne peut être uniquement utilisé dans une catégorie scolaire !`, ephemeral: true });
};