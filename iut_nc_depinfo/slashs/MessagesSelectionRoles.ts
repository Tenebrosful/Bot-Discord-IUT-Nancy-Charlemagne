import { CommandInteraction, MessageActionRow, MessageSelectMenu } from 'discord.js';
import { Discord, Guild as Guildx, Permission, Slash, SlashGroup } from 'discordx';
import { Serveur } from "../../IDs";
import { Role } from '../IDs';
import { RoleAlternantCIASIEOptions, RolesAncienOptions, RolesAutreOptions, RolesBUT1AOptions, RolesDUT2AOptions, RolesLPOptions } from '../selectMenus/Roles';

@Discord()
@Guildx(Serveur.IUT_NC_DEP_INFO) // Alias @Guild due to import name conflict
@Permission(false)
@Permission({ id: Role.ADMIN, type: 'ROLE', permission: true })
@Permission({ id: Role.STAR, type: 'ROLE', permission: true })
@SlashGroup("messageselectionroles", "Commandes ayant pour effet d'envoyer des messages permettant de choisir des rôles")
abstract class MessagesSelectionRoles {

    @Slash('principaux', { description: "Envoie le message permettant d'obtenir les rôles principaux" })
    async principaux(interaction: CommandInteraction) {
        await interaction.deferReply({ ephemeral: true });

        const channel = interaction.channel;

        if (!channel) { interaction.editReply({ content: "Erreur, channel: " + channel }); return; }

        if (!channel.isText()) interaction.reply("Type de salon inattendu.");

        const LPRow = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setCustomId('role-lp')
                    .setPlaceholder("Licences Professionnelles")
                    .addOptions(RolesLPOptions)
            );

        const BUT1ARow = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setCustomId('role-but-1a')
                    .setPlaceholder("BUT 1ère Année")
                    .addOptions(RolesBUT1AOptions)
            );

        const DUT2ARow = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setCustomId('role-dut-2a')
                    .setPlaceholder("DUT 2ème Année")
                    .addOptions(RolesDUT2AOptions)
            );

        const AutreRow = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setCustomId('role-other')
                    .setPlaceholder("Autre")
                    .addOptions(RolesAutreOptions)
            );

        const OldStudentRow = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setCustomId('role-old-student')
                    .setPlaceholder("Ancien étudiant")
                    .addOptions(RolesAncienOptions)
            );

        try {
            await channel.send({ content: "Bienvenue sur le Serveur du Département Informatique de l'IUT Nancy-Charlemagne ! Veuillez sélectionner ce qui vous correspondant via le menu juste en dessous.", components: [LPRow, BUT1ARow, DUT2ARow, AutreRow, OldStudentRow] });
        } catch (err) {
            interaction.editReply({ content: "Une erreur est survenue." });
            console.error(err)
        } finally {
            interaction.editReply({ content: "Done." });
        }
    }

    @Slash('alternanlp', { description: "Envoie le message permettant d'obtenir le rôle alternant pour la LP CIASIE" })
    async messageRoleAlternant(interaction: CommandInteraction) {
        await interaction.deferReply({ ephemeral: true });

        const channel = interaction.channel;

        if (!channel) { interaction.editReply({ content: "Erreur, channel: " + channel }); return; }

        if (!channel.isText()) interaction.reply("Type de salon inattendu.");

        const row = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setCustomId('role-alternant')
                    .setPlaceholder("Veuillez sélectionner une réponse")
                    .addOptions(RoleAlternantCIASIEOptions)
            );

        try {
            await channel.send({ content: "Êtes-vous en alternance ? Si oui, vous pouvez obtenir un rôle spécial afin de faciliter les mentions et avoir un salon regroupant les alternants.", components: [row] });
        } catch (err) {
            interaction.editReply({ content: "Une erreur est survenue." });
            console.log(err)
        } finally {
            interaction.editReply({ content: "Done." });
        }
    }
}