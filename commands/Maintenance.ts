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
}