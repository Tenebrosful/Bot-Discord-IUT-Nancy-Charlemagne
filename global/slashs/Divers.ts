import { CommandInteraction, Message, MessageEmbed } from "discord.js";
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
}