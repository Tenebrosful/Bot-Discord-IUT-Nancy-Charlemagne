import { Discord, Guild, Slash } from 'discordx';
import { CommandInteraction, MessageEmbed, Role } from 'discord.js';
import { RoleIDs } from '../enums/IDs';

@Discord()
abstract class Info {
    @Slash('info', { description: "Affiche les informations du serveur" })
    private async info(interaction: CommandInteraction) {
        if (interaction.channel?.type === "DM") { interaction.reply({ content: "❌ Désolé mais je ne peux pas effectuer cette commande en message privé.", ephemeral: true }) }

        await interaction.deferReply();

        const guild = interaction.guild;

        const oldDUTStudent = guild?.roles.resolve(RoleIDs.ANCIEN_DUT)?.members.size;
        const oldLPStudent = guild?.roles.resolve(RoleIDs.ANCIEN_LP_CIASIE)?.members.size;

        let sumOldStudent = 0;

        if (oldDUTStudent) sumOldStudent += oldDUTStudent;

        if (oldLPStudent) sumOldStudent += oldLPStudent;

        const resEmbed = new MessageEmbed()
            .setColor('#DD131E')
            .setTitle('Informations du Serveur')
            .addFields(
                {
                    name: 'Membres',
                    value: `
                        <@&${RoleIDs.ADMIN}> : \`${guild?.roles.resolve(RoleIDs.ADMIN)?.members.size}\`
                        <@&${RoleIDs.SERVER_BOOSTER}> : \`${guild?.roles.resolve(RoleIDs.SERVER_BOOSTER)?.members.size}\`
                        <@&${RoleIDs.ENSEIGNANT}> : \`${guild?.roles.resolve(RoleIDs.ENSEIGNANT)?.members.size}\`
                        <@&${RoleIDs.DÉLÉGUÉ}> : \`${guild?.roles.resolve(RoleIDs.DÉLÉGUÉ)?.members.size}\`
                        Ancien Étudiant : \`${sumOldStudent}\`
                        <@&${RoleIDs.ÉTUDIANT}> : \`${guild?.roles.resolve(RoleIDs.ÉTUDIANT)?.members.size}\`
                        <@&${RoleIDs.COMPTE_SECONDAIRE}> : \`${guild?.roles.resolve(RoleIDs.COMPTE_SECONDAIRE)?.members.size}\`
                        Total : \`${guild?.memberCount}\`
                           `,
                    inline: true
                },
                {
                    name: 'Promos',
                    value: `
                        <@&${RoleIDs.LP_ACORS}> : \`${guild?.roles.resolve(RoleIDs.LP_ACORS)?.members.size}\`
                        <@&${RoleIDs.LP_AFTER}> : \`${guild?.roles.resolve(RoleIDs.LP_AFTER)?.members.size}\`
                        <@&${RoleIDs.LP_CIASIE}> : \`${guild?.roles.resolve(RoleIDs.LP_CIASIE)?.members.size}\`
                        <@&${RoleIDs.BUT_1A}> : \`${guild?.roles.resolve(RoleIDs.BUT_1A)?.members.size}\`
                        <@&${RoleIDs.DUT_2A}> : \`${guild?.roles.resolve(RoleIDs.DUT_2A)?.members.size}\`
                           `,
                    inline: true
                },
                { name: 'Nombre de salons', value: `${guild?.channels.cache.size}/500` }
            )
            .setTimestamp();

        interaction.editReply({ embeds: [resEmbed] })
    }
}