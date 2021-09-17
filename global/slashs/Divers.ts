import { CommandInteraction, DMChannel, GuildChannel, Message, MessageActionRow, MessageButton, MessageEmbed, VoiceChannel } from "discord.js";
import { DefaultPermission, Discord, Guild, Permission, Slash, SlashOption } from "discordx";
import { allServeursIds, globalAdminPerms, globalEnseignantPerms } from "../GlobalVar";

@Discord()
abstract class Divers {

    @Slash('sondage', { description: "Créé un sondage" })
    async sondage(
        @SlashOption("Titre", { description: "Sujet du sondage", required: true })
        titre: string,
        @SlashOption("Description", { description: "Explications affichées en dessous" })
        desc: string,
        @SlashOption("ImageURL", { description: "Url de l'image affichée en bas du sondage" })
        imageurl: string,
        @SlashOption("VoteNeutre", { description: "Autoriser ou Interdire le vote neutre. Autorisé par défaut." })
        autoriserVoteNeutre: boolean = true,
        interaction: CommandInteraction
    ) {
        await interaction.deferReply();

        const resEmbed = new MessageEmbed()
            .setColor("#DD131E")
            .setAuthor(interaction.user.username, (interaction.user.avatarURL({ dynamic: true }) || undefined))
            .setTitle(titre)
            .setFooter("Tu peux voter en cliquant sur les réactions en dessous")
            .setTimestamp();

        if (desc) { resEmbed.setDescription(desc) }
        if (imageurl) { resEmbed.setImage(imageurl) }

        await interaction.editReply({ embeds: [resEmbed] });

        const reply = await interaction.fetchReply();

        if (!(reply instanceof Message)) { interaction.editReply("Erreur, reply: " + reply.type); return; }

        // Le processus est assez lent pour que la réponse de l'interaction soit supprimé et fasse crash le bot
        try {
            await reply.react("👍");
            if (autoriserVoteNeutre) await reply.react("🤔");
            await reply.react("👎");
        } catch (err) {
            console.error(err);
            try { interaction.editReply("Erreur, vérification des logs."); } catch (err) { console.error(err); return; }
        }
    }

    @Slash('webhook', { description: "Retourne le lien d'un webhook créé par le bot" })
    async webhook(
        @SlashOption("Salon", { type: "CHANNEL", required: true })
        channel: GuildChannel | DMChannel,
        interaction: CommandInteraction
    ) {
        await interaction.deferReply({ ephemeral: true });

        if (channel.isThread()) { interaction.editReply({ content: "❌ Désolé mais je ne peux pas effectuer cette commande sur un Fil" }); return; }
        if (channel.type === "DM") { interaction.editReply({ content: "❌ Désolé mais je ne peux pas effectuer cette commande en message privé sans indiquer un salon précis." }); return; }
        if (!channel.isText()) { interaction.editReply({ content: "❌ Désolé mais je ne peux pas effectuer cette commande sur un salon non-textuel." }); return; }

        if (!(channel.permissionsFor(interaction.user)?.has("MANAGE_WEBHOOKS"))) { interaction.editReply({ content: `❌ Désolé mais tu n'as pas la permission "MANAGE_WEBHOOKS".` }); return; }

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

    @Guild(...allServeursIds)
    @DefaultPermission(false)
    @Permission(...globalAdminPerms)
    @Permission(...globalEnseignantPerms)
    @Slash('groupevocal', { description: "Crée un ou plusieurs salons vocaux temporaire dans cette catégorie (1 salon pendant 60m par défaut)" })
    private async groupevocal(
        @SlashOption('quantité', { description: "Nombre de salon à créer. (10 salon max)" })
        amount: number = 1,
        @SlashOption('durée', { description: "Durée du salon avant sa suppression en minute. (240 minutes = 4 heures max)" })
        duration: number = 60,
        interaction: CommandInteraction
    ) {
        if (amount <= 0) { interaction.reply({ content: "Désolé cependant vous ne pouvez créer une quantité négative ou nulle de salon.", ephemeral: true }); return; }
        if (duration <= 0) { interaction.reply({ content: "Désolé cependant vous ne pouvez créer de salon pour une durée négative ou nulle.", ephemeral: true }); return; }

        if (amount > 10) { interaction.reply({ content: "Désolé cependant vous ne pouvez pas créer plus de 10 salons à la fois.", ephemeral: true }); return; }
        if (duration > 240) { interaction.reply({ content: "Désolé cependant vous ne pouvez créer de salon durant plus de 4 heures.", ephemeral: true }); return; }

        if (interaction.channel?.type !== "GUILD_TEXT") { return; }

        const category = interaction.channel?.parent;

        if (!category) { interaction.reply({ content: "Désolé cependant ce salon n'a pas de catégorie.", ephemeral: true }); return; }

        const guild = interaction.guild;

        if (!guild) { interaction.reply({ content: `Une erreur est survenue (guild: ${guild})`, ephemeral: true }); return; }

        await interaction.deferReply();

        let newSalonsPromise: Promise<VoiceChannel>[] = [];

        for (let i = 0; i < amount; i++) {
            newSalonsPromise.push(guild.channels.create(`💻・Groupe ${i + 1}`, {
                type: "GUILD_VOICE",
                parent: category,
                reason: `Salon vocal de groupe temporaire créé par ${interaction.user.username}`
            }));
        }

        interaction.editReply({ content: "Votre demande est en cours de traitement..." })

        const newChannels = await Promise.all(newSalonsPromise);

        newChannels.forEach(async salon => {
            salon.permissionOverwrites.create(interaction.user, { 'MANAGE_CHANNELS': true }, { reason: "Permissions données au créateur du salon" });
            setTimeout((salon: VoiceChannel) => {
                salon.delete();
            }, duration * 60000, salon);
        });

        interaction.editReply({ content: `Vos ${amount} salons ont été créé pour ${duration} minutes. \`${duration} minutes restantes\`` });

        let minutesSpend = 0;
        const intervalID = setInterval(
            (interaction: CommandInteraction, minutesSpend: number) => {
                interaction.editReply({ content: `Vos ${amount} salons ont été créé pour ${duration} minutes. \`${duration - minutesSpend} minutes restantes\`` });
                minutesSpend++
            }, 60000, interaction, ++minutesSpend);

        setTimeout((intervalID, interaction: CommandInteraction) => { clearInterval(intervalID); interaction.editReply({ content: `Temps écoulé ! Vos salons ont été supprimés.` }) }, duration * 60000, intervalID, interaction);
    }
}