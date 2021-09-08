import { AwaitMessagesOptions, Collection, CommandInteraction, DMChannel, GuildChannel, Message, MessageActionRow, MessageButton, MessageEmbed, Snowflake } from "discord.js";
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
        @SlashOption("createAnnonces", { description: "Voulez-vous créer le salon '📢・annonces' ?" })
        createAnnonces: boolean = false,
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

        if (createAnnonces) {
            const annoncementChannel = await guild?.channels.create("📢・annonces", {
                type: "GUILD_TEXT",
                topic: "Annonces scolaires concernant la classe ou la promo",
                parent: category,
                reason: `Création du salon demandé par ${interaction.user.username} via la commande 'setupCategorieScolaire'`
            });

            await annoncementChannel?.permissionOverwrites.edit(RoleIDs.EVERYONE, { "SEND_MESSAGES": false });
            await annoncementChannel?.permissionOverwrites.edit(RoleIDs.DÉLÉGUÉ, { "SEND_MESSAGES": true });
            await annoncementChannel?.permissionOverwrites.edit(RoleIDs.ENSEIGNANT, { "SEND_MESSAGES": true });
        }

        if (createDocuments) {
            const documentChannel = await guild?.channels.create("📚・documents", {
                type: "GUILD_TEXT",
                topic: "Documents scolaires concernant la classe ou la promo",
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

    @Slash('deleteMessages', { description: "Supprime les derniers messages envoyés il y a moins de 2 semaines. Supprime 100 messages par défaut" })
    private async deleteMessages(
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
        interaction.deferReply({ ephemeral: true })

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
        interaction.deferReply({ ephemeral: true });

        if (channel.isThread()) { interaction.editReply({ content: "❌ Désolé mais je ne peux pas effectuer cette commande sur un Fil" }); return; }
        if (channel.type === "DM") { interaction.editReply({ content: "❌ Désolé mais je ne peux pas effectuer cette commande en message privé sans indiquer un salon précis." }); return; }

        const newChannel = await channel.clone({ reason: `Purge du salon demandé par ${interaction.user.username}` });
        await channel.delete();

        if (channel !== interaction.channel)
            interaction.editReply({ content: `Salon purgé ! ${newChannel}` });
    }

    @Slash('webhook', { description: "Retourne le lien d'un webhook créé par le bot" })
    async webhook(
        @SlashOption("Salon", { type: "CHANNEL", required: true })
        channel: GuildChannel | DMChannel,
        interaction: CommandInteraction
    ) {
        interaction.deferReply({ ephemeral: true });

        if (channel.isThread()) { interaction.editReply({ content: "❌ Désolé mais je ne peux pas effectuer cette commande sur un Fil" }); return; }
        if (channel.type === "DM") { interaction.editReply({ content: "❌ Désolé mais je ne peux pas effectuer cette commande en message privé sans indiquer un salon précis." }); return; }
        if (!channel.isText()) { interaction.editReply({ content: "❌ Désolé mais je ne peux pas effectuer cette commande sur un salon non-textuel." }); return; }

        const webhooks = await channel.fetchWebhooks();

        let webhook = webhooks.find(webhook => {
            if (webhook.owner === null || interaction.client === null || interaction.client.user === null) return false;
            if (!webhook.owner.bot) return false;
            if (webhook.owner.id !== interaction.client.user.id) return false;
            return true;
        });

        if (!webhook) {
            webhook = await channel.createWebhook("Embeds", { reason: `Création du webhook demandé par ${interaction.user.username}` });
        }

        const embed = new MessageEmbed()
            .setTitle("Votre webhook")
            .setDescription(`\`${webhook.url}\``)
            .setColor('#0080ff');

        const row = new MessageActionRow()
            .addComponents(new MessageButton()
                .setStyle("LINK")
                .setLabel("Ouvrir avec Discord.club (SOON)")
                .setURL(`https://discord.club/dashboard?`)
                .setDisabled(true));

        interaction.editReply({ embeds: [embed], components: [row] })
    }
}