import { CommandInteraction } from "discord.js";
import { DefaultPermission, Discord, Guild, Permission, Slash, SlashGroup, SlashOption } from "discordx";
import { RoleIDs, ServerIDs } from "../enums/IDs";

@Discord()
@Guild(ServerIDs.MAIN)
@DefaultPermission(false)
@Permission({ id: RoleIDs.ADMIN, type: 'ROLE', permission: true })
@Permission({ id: RoleIDs.STAR, type: 'ROLE', permission: true })
@SlashGroup("maintenance", "Commandes de maintenance du serveur")
abstract class Maintenance {

    @Slash("setupCategorieScolaire", { description: "Créé les salons basiques communs des catégories scolaires" })
    async setupCategorieScolaire(
        @SlashOption("idCategorie", { description: "ID de la catégorie à affecter", required: true })
        idCat: string,
        @SlashOption("createDocuments", { description: "Voulez-vous créer le salon '📚・documents' ?" })
        createDocuments: boolean = false,
        @SlashOption("createOffreDeStage", { description: "Voulez-vous créer le salon '📬・offres-de-stage' ?" })
        createOffreDeStage: boolean = false,
        interaction: CommandInteraction
    ) {
        await interaction.deferReply({ ephemeral: true });

        if (interaction.channel?.type === "DM") { interaction.editReply({ content: "❌ Désolé mais je ne peux pas effectuer cette commande en message privé." }); return; }

        const guild = interaction.guild;

        let category;

        try { category = await guild?.channels.fetch(idCat); } catch (err) { interaction.editReply({ content: "❓ La catégorie est introuvable." }); return; }

        if (category?.type !== 'GUILD_CATEGORY') { interaction.editReply({ content: "❌ Cela ne s'agit pas d'une catégorie." }); return; }

        interaction.editReply({ content: `Salons en cours de création...` });

        const annoncementChannel = await guild?.channels.create("📢・annonces", {
            type: "GUILD_TEXT",
            topic: "Annonces scolaires concernants la classe ou la promo",
            parent: category,
            reason: `Création du salon demandé par ${interaction.user.username} via la commande 'setupCategorieScolaire'`
        });

        await annoncementChannel?.permissionOverwrites.edit(RoleIDs.EVERYONE, { "SEND_MESSAGES": false });
        await annoncementChannel?.permissionOverwrites.edit(RoleIDs.DÉLÉGUÉ, { "SEND_MESSAGES": true });
        await annoncementChannel?.permissionOverwrites.edit(RoleIDs.ENSEIGNANT, { "SEND_MESSAGES": true });

        if (createDocuments) {
            const documentChannel = await guild?.channels.create("📚・documents", {
                type: "GUILD_TEXT",
                topic: "Documents scolaires concernants la classe ou la promo",
                parent: category,
                reason: `Création du salon demandé par ${interaction.user.username} via la commande 'setupCategorieScolaire'`
            });

            await documentChannel?.permissionOverwrites.edit(RoleIDs.EVERYONE, { "SEND_MESSAGES": false });
            await documentChannel?.permissionOverwrites.edit(RoleIDs.DÉLÉGUÉ, { "SEND_MESSAGES": true });
            await documentChannel?.permissionOverwrites.edit(RoleIDs.ENSEIGNANT, { "SEND_MESSAGES": true });
        }

        if (createOffreDeStage) {
            const offreDeStageChannel = await guild?.channels.create("📬・offres-de-stage", {
                type: "GUILD_TEXT",
                topic: "Offre de stages trouvées par des enseignants ou publiés par des professionnels",
                parent: category,
                reason: `Création du salon demandé par ${interaction.user.username} via la commande 'setupCategorieScolaire'`
            });

            await offreDeStageChannel?.permissionOverwrites.edit(RoleIDs.EVERYONE, { "SEND_MESSAGES": false });
            await offreDeStageChannel?.permissionOverwrites.edit(RoleIDs.DÉLÉGUÉ, { "SEND_MESSAGES": true });
            await offreDeStageChannel?.permissionOverwrites.edit(RoleIDs.ENSEIGNANT, { "SEND_MESSAGES": true });
        }

        await guild?.channels.create("💬・discussions", {
            type: "GUILD_TEXT",
            topic: "Salon de discussions de la classe ou de la promo. N'hésitez pas à démarrer des fils de discussions s'il s'agit d'un sujet spécifique comme un cours en particulier !",
            parent: category,
            reason: `Création du salon demandé par ${interaction.user.username} via la commande 'setupCategorieScolaire'`
        });

        const amphiChannel = await guild?.channels.create("🎤・Amphithéâtre", {
            type: "GUILD_STAGE_VOICE",
            topic: "Conférence réservé à la classe ou à la promo. Les partages d'écrans ne sont pour l'instant pas disponibles",
            parent: category,
            reason: `Création du salon demandé par ${interaction.user.username} via la commande 'setupCategorieScolaire'`
        });

        await amphiChannel?.permissionOverwrites.edit(RoleIDs.ENSEIGNANT, { "MANAGE_CHANNELS": true, "MUTE_MEMBERS": true, "MOVE_MEMBERS": true });
        await amphiChannel?.permissionOverwrites.edit(RoleIDs.DÉLÉGUÉ, { "MANAGE_CHANNELS": true, "MUTE_MEMBERS": true, "MOVE_MEMBERS": true });

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