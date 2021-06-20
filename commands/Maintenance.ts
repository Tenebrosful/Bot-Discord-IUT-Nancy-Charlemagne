import { Discord, Slash, Description, Permission, Guild, Option } from "@typeit/discord";
import { AwaitMessagesOptions, Collection, CommandInteraction, Message, MessageCollector, Snowflake, TextChannel } from "discord.js";
import { SingletonClient } from "..";
import { Role, Server } from "../enums/IDs";

@Discord()
@Guild(Server.MAIN)
@Permission(Role.ADMIN, 'ROLE')
@Permission(Role.STAR, 'ROLE')
abstract class Maintenance {
    @Slash('purgeChannel')
    @Description("Clone et supprime le salon afin de supprimer son contenu")
    private purgeChannel(interaction: CommandInteraction) {
        const channel = <TextChannel>interaction.channel;

        channel.clone({ reason: `Purge du salon demandé par ${interaction.user.username}` });
        channel.delete(`Purge du salon demandé par ${interaction.user.username}`);
    }

    @Slash('supprimerCategorie')
    @Description("Supprime la catégorie parente ainsi que tous ses enfants")
    private supprimerCategorie(interaction: CommandInteraction) {
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
        await SingletonClient.clearSlashes(Server.MAIN);
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
        interaction.defer();

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

        interaction.editReply({ content: messageReply })
    }
}