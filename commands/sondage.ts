import { Discord, Option, Slash, Description, Guild } from "@typeit/discord";
import { CommandInteraction, Message, MessageEmbed } from "discord.js";

@Discord()
abstract class sondage {
    @Slash('sondage')
    private async sondage(
        @Option("Titre", { description: "Message qui sera affiché en tant que sujet du sondage", required: true })
        title: string,
        @Option("VoteNeutre", { description: "Autoriser ou Interdire le vote neutre. Autorisé par défaut." })
        allowNeutralVote: boolean = true,
        @Option("Description", { description: "Explications affichées en dessous du sujet du sondage" })
        desc: string,
        @Option("ImageURL", { description: "Url de l'image affichée en bas du sondage" })
        imageurl: string,
        interaction: CommandInteraction
    ) {
        if (typeof title !== 'string' || typeof allowNeutralVote !== 'boolean' || typeof desc !== 'string' || typeof imageurl !== 'string') { interaction.reply("La commande est mal formée, veuillez vérifier vos paramètres."); return; }

        const resEmbed = new MessageEmbed()
            .setColor("#DD131E")
            .setAuthor(interaction.user.username, interaction.user.avatarURL({ dynamic: true }))
            .setTitle(title)
            .setFooter("Tu peux voter en cliquant sur les réactions en dessous")
            .setTimestamp();

        if (desc) { resEmbed.setDescription(desc) }
        if (imageurl) { resEmbed.setImage(imageurl) }

        await interaction.reply({ embeds: [resEmbed] });

        const reply = await <Promise<Message>>interaction.fetchReply();

        await reply.react("👍");
        if (allowNeutralVote) await reply.react("🤔");
        await reply.react("👎");
    }
}