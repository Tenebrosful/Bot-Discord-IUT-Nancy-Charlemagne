import { DefaultPermission, Description, Discord, Group, Guild, Option, Permission, Slash } from "@typeit/discord";
import { AwaitMessagesOptions, Collection, CommandInteraction, Message, Snowflake, TextChannel } from "discord.js";
import { SingletonClient } from "..";
import { RoleIDs, ServerIDs } from "../enums/IDs";

@Discord()
@Guild(ServerIDs.MAIN)
@DefaultPermission(false)
@Permission({id: RoleIDs.ADMIN, type: 'ROLE', permission: true})
@Permission({id: RoleIDs.STAR, type: 'ROLE', permission: true})
@Group('Maintenance', "Commandes de maintenance du serveur")
abstract class Maintenance {
    @Slash('purgeChannel')
    @Description("Clone et supprime le salon afin de supprimer son contenu")
    private purgeChannel(interaction: CommandInteraction) {
        interaction.defer();

        const channel = <TextChannel>interaction.channel;

        channel.clone({ reason: `Purge du salon demandé par ${interaction.user.username}` });
        channel.delete(`Purge du salon demandé par ${interaction.user.username}`);
    }

    @Slash('supprimerCategorie')
    @Description("Supprime la catégorie parente ainsi que tous ses enfants")
    private supprimerCategorie(interaction: CommandInteraction) {
        interaction.defer({ ephemeral: true });

        const category = (<TextChannel>interaction.channel).parent;

        if (!category) { interaction.editReply({ content: "Ce salon n'a pas de catégorie." }); return; }

        category.children.forEach(channel => channel.delete(`Suppression de la catégorie ${category.name} demandée par ${interaction.user.username}`));

        category.delete(`Suppression de la catégorie ${category.name} demandée par ${interaction.user.username}`);

    }

    @Slash('purgeCategorie')
    @Description("Clone et supprime la catégorie afin de supprimer son contenu")
    private async purgeCategorie(interaction: CommandInteraction) {
        interaction.defer({ ephemeral: true });

        const categorie = (<TextChannel>interaction.channel).parent;

        if (!categorie) { interaction.editReply("Ce salon n'a pas de catégorie."); return; }

        const channels = categorie.children;

        const newCategorie = await categorie.clone({ reason: `Purge de la catégorie demandé par ${interaction.user.username}` });

        channels.forEach(async channel => {
            (await channel.clone()).setParent(newCategorie, { reason: `Purge de la catégorie demandé par ${interaction.user.username}` });
            channel.delete(`Purge de la catégorie demandé par ${interaction.user.username}`);
        })

        categorie.delete(`Purge de la catégorie demandé par ${interaction.user.username}`);
    }

    @Slash('forceCommands')
    @Description("Vide le cache et actualise les commandes du Bot")
    private async forceCommands(interaction: CommandInteraction) {
        interaction.defer({ ephemeral: true });

        await SingletonClient.clearSlashes();
        await SingletonClient.clearSlashes(ServerIDs.MAIN);
        await SingletonClient.initSlashes();

        interaction.editReply({ content: "Le cache a été vidé" });
    }

    @Slash('deleteMessages')
    @Description('Supprime les derniers messages envoyés il y a moins de 2 semaines. Supprime 100 messages par défaut.')
    private async deleteMessages(
        @Option('nombre', { description: "Nombre de message à effacer" })
        nbrMessage: number,
        @Option('jours', { description: "Ancienneté des messages à supprimer en jours" })
        jours: number,
        @Option('heures', { description: "Ancienneté des messages à supprimer en heures" })
        heures: number,
        @Option('minutes', { description: "Ancienneté des messages à supprimer en minutes" })
        minutes: number,
        interaction: CommandInteraction
    ) {
        let listMessages: Collection<Snowflake, Message>;

        if (jours || heures || minutes) {
            let time: number = 0;

            if (jours) time += jours * 8.64e+7;
            if (heures) time += heures * 3.6e+6;
            if (minutes) time += minutes * 60000;

            let options: AwaitMessagesOptions = {
                time
            }

            if (nbrMessage)
                options.max = nbrMessage

            const maxTimeStamp = new Date(Date.now() - time);

            listMessages = (await (<TextChannel>interaction.channel).messages.fetch()).filter(message => message.createdAt >= maxTimeStamp);
        }

        const messagesSupprimes = await (<TextChannel>interaction.channel).bulkDelete((listMessages || nbrMessage || 100), true);
        const nbrMessagesRestant = (listMessages?.size || nbrMessage || 100) - messagesSupprimes.size;

        let messageReply: string = `${messagesSupprimes.size} ${messagesSupprimes.size > 1 ? "messages ont été supprimés" : "message a été supprimé"}.`

        if (nbrMessagesRestant !== 0)
            messageReply += ` ${nbrMessagesRestant} ${nbrMessagesRestant > 1 ? "messages n'ont pas pu être supprimés" : "message n'a pas pu être supprimé"} à cause de la limitation de 2 semaines de Discord. Pour supprimer tout un salon vous pouvez utiliser \`/purgechannel\`.`;

        interaction.reply({ content: messageReply })
    }

    @Slash('supprimervocaux')
    @Description("Supprime tous les salons vocaux de la catégorie")
    private async supprimervocaux(interaction: CommandInteraction) {
        const categorie = (<TextChannel>interaction.channel).parent;

        if (!categorie) { interaction.reply({ content: "Ce salon n'a pas de catégorie.", ephemeral: true }); return; }

        interaction.defer();

        await Promise.all(categorie.children.map(salon => { if (salon.type == 'voice') salon.delete(`Suppression des salons vocaux demandé par ${interaction.user.username}`) }));

        interaction.editReply({ content: `Tous les salons vocaux de cette catégorie ont été supprimés !` });
    }

}