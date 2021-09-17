import { CommandInteraction, MessageEmbed } from 'discord.js';
import { Discord, Guild, Slash } from 'discordx';
import { Serveur } from '../../IDs';
import { Role } from '../IDs';

@Discord()
@Guild(Serveur.IUT_NC_DEP_INFO)
abstract class Divers {

    @Slash('info', { description: "Affiche les informations du serveur" })
    private async info(interaction: CommandInteraction) {

        await interaction.deferReply();

        const guild = interaction.guild;

        const resEmbed = new MessageEmbed()
            .setColor('#DD131E')
            .setTitle('Informations du Serveur')
            .addFields(
                {
                    name: 'Membres',
                    value: `
                        <@&${Role.ADMIN}> : \`${guild?.roles.resolve(Role.ADMIN)?.members.size}\`
                        <@&${Role.SERVER_BOOSTER}> : \`${guild?.roles.resolve(Role.SERVER_BOOSTER)?.members.size}\`
                        <@&${Role.ENSEIGNANT}> : \`${guild?.roles.resolve(Role.ENSEIGNANT)?.members.size}\`
                        <@&${Role.DÉLÉGUÉ}> : \`${guild?.roles.resolve(Role.DÉLÉGUÉ)?.members.size}\`
                        Ancien Étudiant : \`${(guild?.roles.resolve(Role.ANCIEN_DUT)?.members.size || 0) + (guild?.roles.resolve(Role.ANCIEN_LP_CIASIE)?.members.size || 0)}\`
                        <@&${Role.ÉTUDIANT}> : \`${guild?.roles.resolve(Role.ÉTUDIANT)?.members.size}\`
                        <@&${Role.MEMBRE_UL}> : \`${guild?.roles.resolve(Role.MEMBRE_UL)?.members.size}\`
                        <@&${Role.COMPTE_SECONDAIRE}> : \`${guild?.roles.resolve(Role.COMPTE_SECONDAIRE)?.members.size}\`,
                        Total : \`${guild?.memberCount}\`
                           `,
                    inline: true
                },
                {
                    name: 'Promos',
                    value: `
                        <@&${Role.LP_ACORS}> : \`${guild?.roles.resolve(Role.LP_ACORS)?.members.size}\`
                        <@&${Role.LP_AFTER}> : \`${guild?.roles.resolve(Role.LP_AFTER)?.members.size}\`
                        <@&${Role.LP_CIASIE}> : \`${guild?.roles.resolve(Role.LP_CIASIE)?.members.size}\`
                        <@&${Role.BUT_1A}> : \`${guild?.roles.resolve(Role.BUT_1A)?.members.size}\`
                        <@&${Role.DUT_2A}> : \`${guild?.roles.resolve(Role.DUT_2A)?.members.size}\`
                           `,
                    inline: true
                },
                { name: 'Nombre de salons', value: `${guild?.channels.cache.size}/500` }
            )
            .setTimestamp();

        interaction.editReply({ embeds: [resEmbed] })
    }
}