import { CategoryChannel, Channel, CommandInteraction } from "discord.js";
import { Discord, Guild, Permission, Slash, SlashGroup, SlashOption } from "discordx";
import { Serveur } from "../../IDs";
import { Role } from "../IDs";

@Discord()
@Guild(Serveur.IUT_NC_DEP_INFO)
@Permission(false)
@Permission({ id: Role.ADMIN, type: 'ROLE', permission: true })
@Permission({ id: Role.STAR, type: 'ROLE', permission: true })
@SlashGroup("maintenance", "Commandes de maintenance du serveur")
abstract class Maintenance {

    @Slash("setupcategoriescolaire", { description: "Créé les salons basiques communs des catégories scolaires" })
    async setupCategorieScolaire(
        @SlashOption("categorie", { description: "ID de la catégorie à affecter", required: true, type: "CHANNEL" })
        categoryParam: Channel,
        @SlashOption("createannonces", { description: "Voulez-vous créer le salon '📢・annonces' ?" })
        createAnnonces: boolean = false,
        @SlashOption("createdocuments", { description: "Voulez-vous créer le salon '📚・documents' ?" })
        createDocuments: boolean = false,
        @SlashOption("createoffredestage", { description: "Voulez-vous créer le salon '📬・offres-de-stage' ?" })
        createOffreDeStage: boolean = false,
        interaction: CommandInteraction
    ) {
        await interaction.deferReply({ ephemeral: true });

        if (interaction.channel?.type === "DM") { interaction.editReply({ content: "❌ Désolé mais je ne peux pas effectuer cette commande en message privé." }); return; }

        if (categoryParam?.type !== "GUILD_CATEGORY") { interaction.editReply({ content: "❌ Cela ne s'agit pas d'une catégorie." }); return; }

        interaction.editReply({ content: `Salons en cours de création...` });

        const guild = interaction.guild;
        const category = <CategoryChannel>categoryParam;

        if (createAnnonces) {
            const annoncementChannel = await guild?.channels.create("📢・annonces", {
                type: "GUILD_TEXT",
                topic: "Annonces scolaires concernant la classe ou la promo",
                parent: category,
                reason: `Création du salon demandé par ${interaction.user.username} via la commande 'setupCategorieScolaire'`
            });

            await annoncementChannel?.permissionOverwrites.edit(Role.EVERYONE, { "SEND_MESSAGES": false });
            await annoncementChannel?.permissionOverwrites.edit(Role.DÉLÉGUÉ, { "SEND_MESSAGES": true });
            await annoncementChannel?.permissionOverwrites.edit(Role.ENSEIGNANT, { "SEND_MESSAGES": true });
        }

        if (createDocuments) {
            const documentChannel = await guild?.channels.create("📚・documents", {
                type: "GUILD_TEXT",
                topic: "Documents scolaires concernant la classe ou la promo",
                parent: category,
                reason: `Création du salon demandé par ${interaction.user.username} via la commande 'setupCategorieScolaire'`
            });

            await documentChannel?.permissionOverwrites.edit(Role.EVERYONE, { "SEND_MESSAGES": false });
            await documentChannel?.permissionOverwrites.edit(Role.DÉLÉGUÉ, { "SEND_MESSAGES": true });
            await documentChannel?.permissionOverwrites.edit(Role.ENSEIGNANT, { "SEND_MESSAGES": true });
        }

        if (createOffreDeStage) {
            const offreDeStageChannel = await guild?.channels.create("📬・offres-de-stage", {
                type: "GUILD_TEXT",
                topic: "Offre de stages trouvées par des enseignants ou publiés par des professionnels",
                parent: category,
                reason: `Création du salon demandé par ${interaction.user.username} via la commande 'setupCategorieScolaire'`
            });

            await offreDeStageChannel?.permissionOverwrites.edit(Role.EVERYONE, { "SEND_MESSAGES": false });
            await offreDeStageChannel?.permissionOverwrites.edit(Role.DÉLÉGUÉ, { "SEND_MESSAGES": true });
            await offreDeStageChannel?.permissionOverwrites.edit(Role.ENSEIGNANT, { "SEND_MESSAGES": true });
        }

        const discussionsChannel = await guild?.channels.create("💬・discussions", {
            type: "GUILD_TEXT",
            topic: "Salon de discussions de la classe ou de la promo. N'hésitez pas à démarrer des fils de discussions s'il s'agit d'un sujet spécifique comme un cours en particulier !",
            parent: category,
            reason: `Création du salon demandé par ${interaction.user.username} via la commande 'setupCategorieScolaire'`
        });

        discussionsChannel?.edit({
            defaultAutoArchiveDuration:
                (guild?.features.includes("SEVEN_DAY_THREAD_ARCHIVE") ? 10080 :
                    (guild?.features.includes("THREE_DAY_THREAD_ARCHIVE") ? 4320 :
                        1440)
                )
        });

        const amphiChannel = await guild?.channels.create("🎤・Amphithéâtre", {
            type: "GUILD_STAGE_VOICE",
            topic: "Conférence réservé à la classe ou à la promo. Les partages d'écrans ne sont pour l'instant pas disponibles",
            parent: category,
            reason: `Création du salon demandé par ${interaction.user.username} via la commande 'setupCategorieScolaire'`
        });

        await amphiChannel?.permissionOverwrites.edit(Role.ENSEIGNANT, { "MANAGE_CHANNELS": true, "MUTE_MEMBERS": true, "MOVE_MEMBERS": true });
        await amphiChannel?.permissionOverwrites.edit(Role.DÉLÉGUÉ, { "MANAGE_CHANNELS": true, "MUTE_MEMBERS": true, "MOVE_MEMBERS": true });

        await guild?.channels.create("💻・Vocal #1", {
            type: "GUILD_VOICE",
            topic: "Salon vocal réservé à la classe ou à la promo",
            parent: category,
            reason: `Création du salon demandé par ${interaction.user.username} via la commande 'setupCategorieScolaire'`
        });

        await guild?.channels.create("💻・Vocal #2", {
            type: "GUILD_VOICE",
            topic: "Salon vocal réservé à la classe ou à la promo",
            parent: category,
            reason: `Création du salon demandé par ${interaction.user.username} via la commande 'setupCategorieScolaire'`
        });

        interaction.editReply({ content: `Les salons ont été créés !` });
    }
}