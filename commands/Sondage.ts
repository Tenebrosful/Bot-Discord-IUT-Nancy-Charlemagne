import { CommandInteraction, Message, MessageEmbed } from "discord.js";
import { DefaultPermission, Discord, Guild, Slash, SlashOption } from "discordx";
import { ServerIDs } from "../enums/IDs";

@Discord()
@Guild(ServerIDs.MAIN)
@DefaultPermission(true)
abstract class Sondage {

    @Slash('sondage', { description: "Créé un sondage" })
    async sondage(
        @SlashOption("Titre", { description: "Sujet du sondage", required: true })
        title: string,
        @SlashOption("Description", { description: "Explications affichées en dessous" })
        desc: string,
        @SlashOption("ImageURL", { description: "Url de l'image affichée en bas du sondage" })
        imageurl: string,
        @SlashOption("VoteNeutre", { description: "Autoriser ou Interdire le vote neutre. Autorisé par défaut." })
        allowNeutralVote: boolean = true,
        interaction: CommandInteraction
    ) {
        await interaction.deferReply();

        const resEmbed = new MessageEmbed()
            .setColor("#DD131E")
            .setAuthor(interaction.user.username, (interaction.user.avatarURL({ dynamic: true }) || undefined))
            .setTitle(title)
            .setFooter("Tu peux voter en cliquant sur les réactions en dessous")
            .setTimestamp();

        if (desc) { resEmbed.setDescription(desc) }
        if (imageurl) { resEmbed.setImage(imageurl) }

        await interaction.editReply({ embeds: [resEmbed] });

        const reply = await interaction.fetchReply();

        try {
            //@ts-ignore
            await reply.react("👍");
            //@ts-ignore
            if (allowNeutralVote) await reply.react("🤔");
            //@ts-ignore
            await reply.react("👎");
        } catch (err) {
            interaction.editReply("Erreur <@227882902031958016>, " + reply.type)
        }

    }
}