import { CategoryChannel, Channel, CommandInteraction, MessageActionRow, MessageButton } from "discord.js";
import { Discord, Guild, Permission, Slash, SlashGroup, SlashOption } from "discordx";
import { globalAdminPerms } from "../../global/GlobalVar";
import { Serveur } from "../../IDs";
import { Role } from "../IDs";

@Discord()
@Guild(Serveur.IUT_NC_DEP_INFO)
@Permission(false)
@Permission(...globalAdminPerms)
@Permission({ id: Role.ENSEIGNANT, type: "ROLE", permission: true })
@SlashGroup("enseignant", "Commandes destinés aux enseignants")
abstract class Enseignants {

    @Slash("creerSalonCours", { description: "Permet de créer un salon textuel prévus pour un cours particulier" })
    async creerSalonCours(
        @SlashOption("categorie", { description: "Catégorie à affecter", required: true, type: "CHANNEL" })
        categoryParam: Channel,
        @SlashOption("nom", { description: "Nom du cours", required: true })
        name: string,
        interaction: CommandInteraction
    ) {
        await interaction.deferReply({ ephemeral: true });

        if (interaction.channel?.type === "DM") { interaction.editReply({ content: "❌ Désolé mais je ne peux pas effectuer cette commande en message privé." }); return; }

        if (categoryParam?.type !== "GUILD_CATEGORY") { interaction.editReply({ content: "❌ Cela ne s'agit pas d'une catégorie." }); return; }

        interaction.editReply({ content: `Salons en cours de création...` });

        const guild = interaction.guild;
        const category = <CategoryChannel>categoryParam;

        const newChannel = await guild?.channels.create(`🎓・${name}`, {
            type: "GUILD_TEXT",
            topic: `Cours de ${name}.`,
            parent: category,
            reason: `Création du salon demandé par ${interaction.user.username} via la commande 'enseignant creerSalonCours'`
        });

        const linkTo = new MessageActionRow()
            .addComponents(new MessageButton()
                .setStyle('LINK')
                .setURL(`https://discord.com/channels/${guild?.id}/${newChannel?.id}`))

        interaction.editReply({ content: `Le salon a été créé !`, components: [linkTo] });
    }
}