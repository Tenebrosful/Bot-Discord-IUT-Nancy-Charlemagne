import { Description, Discord, Option, Slash } from "@typeit/discord";
import { MessageEmbed } from "discord.js";
import { CommandInteraction, DiscordAPIError } from "discord.js";
import { Role } from "../enums/IDs";

@Discord()
abstract class Info {
    @Slash('info')
    @Description('Affiche les informations du serveur')
    private info(
        interaction: CommandInteraction
    ) {
        if (!interaction.channel || interaction.channel.type === 'dm') { interaction.reply({ content: "Désolé mais je ne peux pas effectuer cette commande en message privé.", ephemeral: true }); return; }
        
        interaction.defer();

        const guild = interaction.guild;
        const resEmbed = new MessageEmbed()
            .setColor('#DD131E')
            .setTitle('Informations du Serveur')
            .addFields(
                {
                    name: 'Membres',
                    value: `
                        <@&${Role.ADMIN}> : \`${guild.roles.resolve(Role.ADMIN).members.size}\`
                        <@&${Role.SERVER_BOOSTER}> : \`${guild.roles.resolve(Role.SERVER_BOOSTER).members.size}\`
                        <@&${Role.ENSEIGNANT}> : \`${guild.roles.resolve(Role.ENSEIGNANT).members.size}\`
                        <@&${Role.DÉLÉGUÉ}> : \`${guild.roles.resolve(Role.DÉLÉGUÉ).members.size}\`
                        <@&${Role.ÉTUDIANT}> : \`${guild.roles.resolve(Role.ÉTUDIANT).members.size}\`
                        <@&${Role.COMPTE_SECONDAIRE}> : \`${guild.roles.resolve(Role.COMPTE_SECONDAIRE).members.size}\`
                        Total : \`${guild.memberCount}\`
                           `,
                    inline: true
                },
                {
                    name: 'Promos',
                    value: `
                        <@&${Role.LP_ACORS}> : \`${guild.roles.resolve(Role.LP_ACORS).members.size}\`
                        <@&${Role.LP_AFTER}> : \`${guild.roles.resolve(Role.LP_AFTER).members.size}\`
                        <@&${Role.LP_CIASIE}> : \`${guild.roles.resolve(Role.LP_CIASIE).members.size}\`
                        <@&${Role.DUT_1A}> : \`${guild.roles.resolve(Role.DUT_1A).members.size}\`
                        <@&${Role.DUT_2A}> : \`${guild.roles.resolve(Role.DUT_2A).members.size}\`
                        <@&${Role.DUT_AS}> : \`${guild.roles.resolve(Role.DUT_AS).members.size}\`
                           `,
                    inline: true
                },
                { name: 'Nombre de salons', value: `${guild.channels.cache.size}/500` }
            )
            .setTimestamp();

        interaction.editReply({ embeds: [resEmbed] });
    }
}