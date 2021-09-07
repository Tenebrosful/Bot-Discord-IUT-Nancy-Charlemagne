import { CommandInteraction, MessageActionRow, MessageSelectMenu } from "discord.js";
import { Discord, DefaultPermission, Guild, Permission, Slash } from "discordx";
import { ServerIDs, RoleIDs } from "../enums/IDs";

@Discord()
@Guild(ServerIDs.MAIN)
@DefaultPermission(false)
@Permission({ id: RoleIDs.ADMIN, type: 'ROLE', permission: true })
@Permission({ id: RoleIDs.STAR, type: 'ROLE', permission: true })
abstract class Role {

    @Slash('messageroles', { description: "Envoie le message permettant d'obtenir les rôles" })
    private async messageroles(interaction: CommandInteraction) {
        await interaction.deferReply({ ephemeral: true });

        const channel = interaction.channel;

        if (!channel) { interaction.editReply({ content: "Erreur, channel: " + channel }); return; }

        if (!channel.isText()) interaction.reply("Type de salon inattendu.");

        const licensesProRow = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setCustomId('role-lp')
                    .setPlaceholder("Licences Professionnelles")
                    .addOptions([
                        {
                            label: "Licenses Pro. ACORS",
                            value: "lp-ACORS",
                            description: "Vous êtes en Licences Professionnelle ACORS ?"
                        },
                        {
                            label: "Licenses Pro. AFTER",
                            value: "lp-AFTER",
                            description: "Vous êtes en Licences Professionnelle AFTER ?"
                        },
                        {
                            label: "Licenses Pro. CIASIE 1",
                            value: "lp-CIASIE-1",
                            description: "Vous êtes en Licences Professionnelle CIASIE (Groupe 1) ?"
                        },
                        {
                            label: "Licenses Pro. CIASIE 2",
                            value: "lp-CIASIE-2",
                            description: "Vous êtes en Licences Professionnelle CIASIE (Groupe 2) ?"
                        }]));

        const BUTRow = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setCustomId('role-but')
                    .setPlaceholder("BUT / DUT")
                    .addOptions([
                        {
                            label: "BUT 1ère Année",
                            value: "but-1A",
                            description: "Vous êtes en 1ère Année de BUT ?"
                        },
                        {
                            label: "DUT 2ème Année",
                            value: "dut-2A",
                            description: "Vous êtes en 2ème Année de DUT ?"
                        }
                    ])
            );

        const NotStudentRow = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setCustomId('role-other')
                    .setPlaceholder("Non-étudiant")
                    .addOptions([
                        {
                            label: "Enseignant",
                            value: "teacher",
                            description: "Vous êtes enseignant ?"
                        }
                    ])
            );

        const OldStudentRow = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setCustomId('role-old-student')
                    .setPlaceholder("Ancien étudiant")
                    .addOptions([
                        /*{
                            label: "Ancien LP ACORS",
                            value: "old-lp-ACORS",
                            description: "Vous êtes un ancien de la LP ACORS ?"
                        },
                        {
                            label: "Ancien LP AFTER",
                            value: "old-lp-AFTER",
                            description: "Vous êtes un ancien de la LP AFTER ?"
                        },*/
                        {
                            label: "Ancien LP CIASIE",
                            value: "old-lp-CIASIE",
                            description: "Vous êtes un ancien de la LP CIASIE ?"
                        },
                        {
                            label: "Ancien DUT",
                            value: "old-DUT",
                            description: "Vous êtes un ancien du DUT ?"
                        }
                    ])
            );

        try {
            await channel.send({ content: "Bienvenue sur le Serveur du Département Informatique de l'IUT Nancy-Charlemagne ! Veuillez sélectionner ce qui vous correspondant via le menu juste en dessous.", components: [licensesProRow, BUTRow, NotStudentRow, OldStudentRow] });
        } catch (err) {
            interaction.editReply({ content: "Une erreur est survenue." });
            console.log(err)
        } finally {
            interaction.editReply({ content: "Done." });
        }
    }
}