import { DefaultPermission, Description, Discord, Option, Slash } from "@typeit/discord";
import { CommandInteraction, Message, MessageEmbed } from "discord.js";

@Discord()
@DefaultPermission(true)
abstract class sondage {
    @Slash('sondage')
    @Description("Créé un sondage")
    private async sondage(
        @Option("Titre", { description: "Message qui sera affiché en tant que sujet du sondage", required: true })
        title: string,
        @Option("Description", { description: "Explications affichées en dessous du sujet du sondage" })
        desc: string,
        @Option("ImageURL", { description: "Url de l'image affichée en bas du sondage" })
        imageurl: string,
        @Option("VoteNeutre", { description: "Autoriser ou Interdire le vote neutre. Autorisé par défaut." })
        allowNeutralVote: boolean = true,
        interaction: CommandInteraction
    ) {
        await interaction.defer();

        const resEmbed = new MessageEmbed()
            .setColor("#DD131E")
            .setAuthor(interaction.user.username, interaction.user.avatarURL({ dynamic: true }))
            .setTitle(title)
            .setFooter("Tu peux voter en cliquant sur les réactions en dessous")
            .setTimestamp();

        if (desc) { resEmbed.setDescription(desc) }
        if (imageurl) { resEmbed.setImage(imageurl) }

        await interaction.editReply({ embeds: [resEmbed] });

        const reply = await interaction.fetchReply();
        
        if (reply.type !== "REPLY") return;

        await reply.react("👍");
        if (allowNeutralVote) await reply.react("🤔");
        await reply.react("👎");
    }
}