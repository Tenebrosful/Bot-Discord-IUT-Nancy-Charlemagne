import { CommandInteraction, DMChannel, GuildChannel, Message, MessageActionRow, MessageButton, MessageEmbed } from "discord.js";
import { Discord, Slash, SlashOption } from "discordx";

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
}