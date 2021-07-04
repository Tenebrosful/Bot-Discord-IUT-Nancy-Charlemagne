import { DefaultPermission, Description, Discord, Group, Guard, Guild, Option, Permission, Slash } from "@typeit/discord";
import { channel } from "diagnostic_channel";
import { AwaitMessagesOptions, Collection, CommandInteraction, Message, NewsChannel, Snowflake, TextChannel, ThreadChannel } from "discord.js";
import { SingletonClient } from "..";
import { RoleIDs, ServerIDs } from "../enums/IDs";
import { notDMChannel, notThreadChannel } from "../guards/channelTypeFilter";

@Discord()
@Guild(ServerIDs.MAIN)
@Guard(notDMChannel, notThreadChannel)
@DefaultPermission(false)
@Permission({ id: RoleIDs.ADMIN, type: 'ROLE', permission: true })
@Permission({ id: RoleIDs.STAR, type: 'ROLE', permission: true })
@Group('Maintenance', "Commandes de maintenance du serveur")
abstract class Maintenance {
    @Slash('purgeChannel')
    @Description("Clone et supprime le salon afin de supprimer son contenu")
    private purgeChannel(interaction: CommandInteraction) {
        interaction.defer();

        // Can't be DMChannel or ThreadChannel with the global Guard
        const channel = <TextChannel | NewsChannel>interaction.channel;

        channel.clone({ reason: `Purge du salon demandé par ${interaction.user.username}` });
        channel.delete(`Purge du salon demandé par ${interaction.user.username}`);
    }

    @Slash('supprimerCategorie')
    @Description("Supprime la catégorie parente ainsi que tous ses enfants")
    private async supprimerCategorie(interaction: CommandInteraction) {
        await interaction.defer({ ephemeral: true });

        // Can't be DMChannel or ThreadChannel with the global Guard
        const channel = <TextChannel | NewsChannel>interaction.channel;
        const category = channel.parent;

        if (!category) { interaction.editReply({ content: "Ce salon n'a pas de catégorie." }); return; }

        category.children.forEach(c => c.delete(`Suppression de la catégorie ${category.name} demandée par ${interaction.user.username}`));

        category.delete(`Suppression de la catégorie ${category.name} demandée par ${interaction.user.username}`);

    }

    @Slash('purgeCategorie')
    @Description("Clone et supprime la catégorie afin de supprimer son contenu")
    private async purgeCategorie(interaction: CommandInteraction) {
        await interaction.defer({ ephemeral: true });

        // Can't be DMChannel or ThreadChannel with the global Guard
        const channel = <TextChannel | NewsChannel>interaction.channel;
        const category = channel.parent;

        if (!category) { interaction.editReply("Ce salon n'a pas de catégorie."); return; }

        const channels = category.children;

        const newCategory = await category.clone({ reason: `Purge de la catégorie demandé par ${interaction.user.username}` });

        channels.forEach(async c => {
            (await c.clone()).setParent(newCategory, { reason: `Purge de la catégorie demandé par ${interaction.user.username}` });
            c.delete(`Purge de la catégorie demandé par ${interaction.user.username}`);
        })

        category.delete(`Purge de la catégorie demandé par ${interaction.user.username}`);
    }

    @Slash('forceCommands')
    @Description("Vide le cache et actualise les commandes du Bot")
    private async forceCommands(interaction: CommandInteraction) {
        await interaction.defer({ ephemeral: true });

        await SingletonClient.clearSlashes();
        await SingletonClient.clearSlashes(ServerIDs.MAIN);
        await SingletonClient.initSlashes();

        interaction.editReply({ content: "Le cache a été vidé" });
    }

    @Slash('deleteMessages')
    @Description('Supprime les derniers messages envoyés il y a moins de 2 semaines. Supprime 100 messages par défaut.')
    private async deleteMessages(
        @Option('nombre', { description: "Nombre de message à effacer" })
        amount: number,
        @Option('jours', { description: "Ancienneté des messages à supprimer en jours" })
        days: number,
        @Option('heures', { description: "Ancienneté des messages à supprimer en heures" })
        hours: number,
        @Option('minutes', { description: "Ancienneté des messages à supprimer en minutes" })
        minutes: number,
        interaction: CommandInteraction
    ) {
        let messageList: Collection<Snowflake, Message>;
        // Can't be DMChannel or ThreadChannel with the global Guard
        const channel = <TextChannel | NewsChannel>interaction.channel;

        if (days || hours || minutes) {
            let time: number = 0;

            if (days) time += days * 8.64e+7;
            if (hours) time += hours * 3.6e+6;
            if (minutes) time += minutes * 60000;

            let options: AwaitMessagesOptions = {
                time
            }

            if (amount)
                options.max = amount

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

    @Slash('supprimervocaux')
    @Description("Supprime tous les salons vocaux de la catégorie")
    private async supprimervocaux(interaction: CommandInteraction) {
        // Can't be DMChannel or ThreadChannel with the global Guard
        const channel = <TextChannel | NewsChannel>interaction.channel;
        const category = channel.parent;

        if (!category) { interaction.reply({ content: "Ce salon n'a pas de catégorie.", ephemeral: true }); return; }

        await interaction.defer();

        await Promise.all(category.children.map(salon => { if (salon.type == 'voice') salon.delete(`Suppression des salons vocaux demandé par ${interaction.user.username}`) }));

        interaction.editReply({ content: `Tous les salons vocaux de cette catégorie ont été supprimés !` });
    }

}