import { AwaitMessagesOptions, Collection, CommandInteraction, DMChannel, GuildChannel, Message, Snowflake } from "discord.js";
import { DefaultPermission, Discord, Guild, Permission, Slash, SlashGroup, SlashOption } from "discordx";
import { allServeursIds, globalAdminPerms } from "../GlobalVar";

@Discord()
@Guild(...allServeursIds)
@DefaultPermission(false)
@Permission(...globalAdminPerms)
@SlashGroup("mod", "Commandes de modération")
abstract class Modération {

    @Slash('deleteMessages', { description: "Supprime les derniers messages envoyés il y a moins de 2 semaines. Supprime 100 messages par défaut" })
    async deleteMessages(
        @SlashOption('nombre', { description: "Nombre de message à effacer" })
        amount: number,
        @SlashOption('jours', { description: "Ancienneté des messages à supprimer en jours" })
        days: number = 0,
        @SlashOption('heures', { description: "Ancienneté des messages à supprimer en heures" })
        hours: number = 0,
        @SlashOption('minutes', { description: "Ancienneté des messages à supprimer en minutes" })
        minutes: number = 0,
        interaction: CommandInteraction
    ) {
        await interaction.deferReply({ ephemeral: true })

        const channel = interaction.channel;

        if (!channel) { interaction.editReply({ content: "Erreur, channel: " + channel }); return; }

        if (channel?.type === "DM") { interaction.editReply({ content: "❌ Désolé mais je ne peux pas effectuer cette commande en message privé." }); return; }

        let messageList: Collection<Snowflake, Message> = new Collection<Snowflake, Message>();

        if (days || hours || minutes) {
            const time: number = days * 8.64e+7 + hours * 3.6e+6 + minutes * 60000;

            let Options: AwaitMessagesOptions = {
                time
            }

            if (amount)
                Options.max = amount

            const maxTimestamp = new Date(Date.now() - time);

            messageList = (await channel.messages.fetch()).filter(message => message.createdAt >= maxTimestamp);
        }

        const deletedMessages = await channel.bulkDelete((messageList || amount || 100), true);
        const notDeletedMessageAmount = (messageList?.size || amount || 100) - deletedMessages.size;

        let replyMessage: string = `${deletedMessages.size} ${deletedMessages.size > 1 ? "messages ont été supprimés" : "message a été supprimé"}.`

        if (notDeletedMessageAmount !== 0)
            replyMessage += ` ${notDeletedMessageAmount} ${notDeletedMessageAmount > 1 ? "messages n'ont pas pu être supprimés" : "message n'a pas pu être supprimé"}. Cela est peut être dû à la limitation de 2 semaines de Discord (Ou qu'il n'y avait pas autant de message dans le salon). Pour supprimer tout un salon vous pouvez utiliser \`/purgechannel\`.`;

        interaction.reply({ content: replyMessage })
    }

    @Slash('purgeChannel', { description: "Clone et supprime le salon afin de supprimer son contenu" })
    async purgeChannel(
        @SlashOption("channel", { description: "Salon à purger. Salon actuel par défaut", type: "CHANNEL", required: true })
        channel: GuildChannel | DMChannel,
        interaction: CommandInteraction
    ) {
        await interaction.deferReply({ ephemeral: true });

        if (channel.isThread()) { interaction.editReply({ content: "❌ Désolé mais je ne peux pas effectuer cette commande sur un Fil" }); return; }
        if (channel.type === "DM") { interaction.editReply({ content: "❌ Désolé mais je ne peux pas effectuer cette commande en message privé sans indiquer un salon précis." }); return; }

        const newChannel = await channel.clone({ reason: `Purge du salon demandé par ${interaction.user.username}` });
        await channel.delete();

        if (channel !== interaction.channel)
            interaction.editReply({ content: `Salon purgé ! ${newChannel}` });
    }

}