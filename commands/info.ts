import { Description, Discord, Option, Slash } from "@typeit/discord";
import { MessageEmbed } from "discord.js";
import { CommandInteraction, DiscordAPIError } from "discord.js";

@Discord()
abstract class Info {
    @Slash('info')
    @Description('Affiche les informations du serveur')
    private info(
        interaction: CommandInteraction
    ) {
        const guild = interaction.guild;
        const resEmbed = new MessageEmbed()
            .setColor('#DD131E')
            .setTitle('Informations du Serveur')
            .addFields(
                {
                    name: 'Membres',
                    value: `
                        <@&753182939352793138> : \`${guild.roles.resolve('753182939352793138').members.size}\`
                        <@&767999978819420161> : \`${guild.roles.resolve('767999978819420161').members.size}\`
                        <@&753181438903320586> : \`${guild.roles.resolve('753181438903320586').members.size}\`
                        <@&753555303265730590> : \`${guild.roles.resolve('753555303265730590').members.size}\`
                        <@&753184280636686356> : \`${guild.roles.resolve('753184280636686356').members.size}\`
                        <@&786941679622029362> : \`${guild.roles.resolve('786941679622029362').members.size}\`
                        Total : \`${guild.memberCount}\`
                           `,
                    inline: true
                },
                {
                    name: 'Promos',
                    value: `
                        <@&756579988265893908> : \`${guild.roles.resolve('756579988265893908').members.size}\`
                        <@&756579864416485377> : \`${guild.roles.resolve('756579864416485377').members.size}\`
                        <@&756578998120611940> : \`${guild.roles.resolve('756578998120611940').members.size}\`
                        <@&756579307597463632> : \`${guild.roles.resolve('756579307597463632').members.size}\`
                        <@&756579488418103396> : \`${guild.roles.resolve('756579488418103396').members.size}\`
                        <@&756579565299695636> : \`${guild.roles.resolve('756579565299695636').members.size}\`
                           `,
                    inline: true
                },
                { name: 'Nombre de salons', value: `${guild.channels.cache.size}/500` }
            )
            .setTimestamp();

        interaction.reply({ embeds: [resEmbed] });
    }
}