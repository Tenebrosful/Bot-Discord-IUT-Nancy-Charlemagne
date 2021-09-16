import { CommandInteraction, Guild, MessageActionRow, MessageSelectMenu, SelectMenuInteraction, User } from "discord.js";
import { DefaultPermission, Discord, Guild as Guildx, Permission, SelectMenuComponent, Slash } from "discordx";
import { ChannelIDs, RoleIDs, ServerIDs } from "../enums/IDs";

@Discord()
@Guildx(ServerIDs.MAIN) // Alias @Guild due to import name conflict
@DefaultPermission(false)
@Permission({ id: RoleIDs.ADMIN, type: 'ROLE', permission: true })
@Permission({ id: RoleIDs.STAR, type: 'ROLE', permission: true })
abstract class Role {

    @Slash('messageroles', { description: "Envoie le message permettant d'obtenir les rôles" })
    async messageroles(interaction: CommandInteraction) {
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

        const BUT1ARow = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setCustomId('role-but-1a')
                    .setPlaceholder("BUT 1ère Année")
                    .addOptions([
                        {
                            label: "BUT 1ère Année A",
                            value: "but-1A-a",
                            description: "Vous êtes en 1ère Année de BUT (Groupe A)?"
                        },
                        {
                            label: "BUT 1ère Année B",
                            value: "but-1A-b",
                            description: "Vous êtes en 1ère Année de BUT (Groupe B)?"
                        },
                        {
                            label: "BUT 1ère Année C",
                            value: "but-1A-c",
                            description: "Vous êtes en 1ère Année de BUT (Groupe C)?"
                        },
                        {
                            label: "BUT 1ère Année D",
                            value: "but-1A-d",
                            description: "Vous êtes en 1ère Année de BUT (Groupe D)?"
                        },
                        {
                            label: "BUT 1ère Année E",
                            value: "but-1A-e",
                            description: "Vous êtes en 1ère Année de BUT (Groupe E)?"
                        }
                    ])
            );

        const DUT2ARow = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setCustomId('role-dut-2a')
                    .setPlaceholder("DUT 2ème Année")
                    .addOptions([
                        {
                            label: "DUT 2ème Année A",
                            value: "dut-2A-a",
                            description: "Vous êtes en 2ème Année de DUT (Groupe A)?"
                        },
                        {
                            label: "DUT 2ème Année B",
                            value: "dut-2A-b",
                            description: "Vous êtes en 2ème Année de DUT (Groupe B)?"
                        },
                        {
                            label: "DUT 2ème Année C",
                            value: "dut-2A-c",
                            description: "Vous êtes en 2ème Année de DUT (Groupe C)?"
                        },
                        {
                            label: "DUT 2ème Année D",
                            value: "dut-2A-d",
                            description: "Vous êtes en 2ème Année de DUT (Groupe D)?"
                        }
                    ])
            );

        const NotStudentRow = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setCustomId('role-other')
                    .setPlaceholder("Non-étudiant du département")
                    .addOptions([
                        {
                            label: "Enseignant du département",
                            value: "teacher",
                            description: "Vous êtes enseignant du Département Informatique ?"
                        },
                        {
                            label: "Membre de l'Université de Lorraine",
                            value: "membreUL",
                            description: "Vous êtes étudiant / enseignant / autre chose au sein de l'Université de Lorraine ?"
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
            await channel.send({ content: "Bienvenue sur le Serveur du Département Informatique de l'IUT Nancy-Charlemagne ! Veuillez sélectionner ce qui vous correspondant via le menu juste en dessous.", components: [licensesProRow, BUT1ARow, DUT2ARow, NotStudentRow, OldStudentRow] });
        } catch (err) {
            interaction.editReply({ content: "Une erreur est survenue." });
            console.log(err)
        } finally {
            interaction.editReply({ content: "Done." });
        }
    }

    @SelectMenuComponent('role-lp')
    async selectMenuLP(interaction: SelectMenuInteraction) {
        await interaction.deferReply({ ephemeral: true });

        const roleValue = interaction.values?.[0];

        if (!roleValue) { interaction.editReply({ content: `Erreur, value = ${roleValue}` }); return; }

        const user = interaction.user;

        const guild = interaction.guild;

        if (!guild) { interaction.editReply({ content: `Erreur, value = ${guild}` }); return; }

        switch (roleValue) {
            case 'lp-ACORS':
                await this.assignRole(guild, user, RoleIDs.LP_ACORS, interaction);
                await this.assignRole(guild, user, RoleIDs.ÉTUDIANT, interaction);
                break;
            case 'lp-AFTER':
                await this.assignRole(guild, user, RoleIDs.LP_AFTER, interaction);
                await this.assignRole(guild, user, RoleIDs.ÉTUDIANT, interaction);
                break;
            case 'lp-CIASIE-1':
                await this.assignRole(guild, user, RoleIDs.LP_CIASIE, interaction);
                await this.assignRole(guild, user, RoleIDs.LP_CIASIE_1, interaction);
                await this.assignRole(guild, user, RoleIDs.ÉTUDIANT, interaction);
                break;
            case 'lp-CIASIE-2':
                await this.assignRole(guild, user, RoleIDs.LP_CIASIE, interaction);
                await this.assignRole(guild, user, RoleIDs.LP_CIASIE_2, interaction);
                await this.assignRole(guild, user, RoleIDs.ÉTUDIANT, interaction);
                break;
            default:
                await interaction.followUp({ content: `Erreur, value = ${roleValue}`, ephemeral: true });
        }
    }

    @SelectMenuComponent('role-but-1a')
    async selectMenuBUT1A(interaction: SelectMenuInteraction) {
        await interaction.deferReply({ ephemeral: true });

        const roleValue = interaction.values?.[0];

        if (!roleValue) { interaction.editReply({ content: `Erreur, value = ${roleValue}` }); return; }

        const user = interaction.user;

        const guild = interaction.guild;

        if (!guild) { interaction.editReply({ content: `Erreur, value = ${guild}` }); return; }

        switch (roleValue) {
            case 'but-1A-a':
                await this.assignRole(guild, user, RoleIDs.BUT_1A, interaction);
                await this.assignRole(guild, user, RoleIDs.BUT_1A_A, interaction);
                await this.assignRole(guild, user, RoleIDs.ÉTUDIANT, interaction);
                break;
            case 'but-1A-b':
                await this.assignRole(guild, user, RoleIDs.BUT_1A, interaction);
                await this.assignRole(guild, user, RoleIDs.BUT_1A_B, interaction);
                await this.assignRole(guild, user, RoleIDs.ÉTUDIANT, interaction);
                break;
            case 'but-1A-c':
                await this.assignRole(guild, user, RoleIDs.BUT_1A, interaction);
                await this.assignRole(guild, user, RoleIDs.BUT_1A_C, interaction);
                await this.assignRole(guild, user, RoleIDs.ÉTUDIANT, interaction);
                break;
            case 'but-1A-d':
                await this.assignRole(guild, user, RoleIDs.BUT_1A, interaction);
                await this.assignRole(guild, user, RoleIDs.BUT_1A_D, interaction);
                await this.assignRole(guild, user, RoleIDs.ÉTUDIANT, interaction);
                break;
            case 'but-1A-e':
                await this.assignRole(guild, user, RoleIDs.BUT_1A, interaction);
                await this.assignRole(guild, user, RoleIDs.BUT_1A_E, interaction);
                await this.assignRole(guild, user, RoleIDs.ÉTUDIANT, interaction);
                break;
            default:
                await interaction.followUp({ content: `Erreur, value = ${roleValue}`, ephemeral: true });
        }
    }

    @SelectMenuComponent('role-dut-2a')
    async selectMenuDUT2A(interaction: SelectMenuInteraction) {
        await interaction.deferReply({ ephemeral: true });

        const roleValue = interaction.values?.[0];

        if (!roleValue) { interaction.editReply({ content: `Erreur, value = ${roleValue}` }); return; }

        const user = interaction.user;

        const guild = interaction.guild;

        if (!guild) { interaction.editReply({ content: `Erreur, value = ${guild}` }); return; }

        switch (roleValue) {
            case 'dut-2A-a':
                await this.assignRole(guild, user, RoleIDs.DUT_2A, interaction);
                await this.assignRole(guild, user, RoleIDs.DUT_2A_A, interaction);
                await this.assignRole(guild, user, RoleIDs.ÉTUDIANT, interaction);
                break;
            case 'dut-2A-b':
                await this.assignRole(guild, user, RoleIDs.DUT_2A, interaction);
                await this.assignRole(guild, user, RoleIDs.DUT_2A_B, interaction);
                await this.assignRole(guild, user, RoleIDs.ÉTUDIANT, interaction);
                break;
            case 'dut-2A-c':
                await this.assignRole(guild, user, RoleIDs.DUT_2A, interaction);
                await this.assignRole(guild, user, RoleIDs.DUT_2A_C, interaction);
                await this.assignRole(guild, user, RoleIDs.ÉTUDIANT, interaction);
                break;
            case 'dut-2A-d':
                await this.assignRole(guild, user, RoleIDs.DUT_2A, interaction);
                await this.assignRole(guild, user, RoleIDs.DUT_2A_D, interaction);
                await this.assignRole(guild, user, RoleIDs.ÉTUDIANT, interaction);
                break;
            default:
                await interaction.followUp({ content: `Erreur, value = ${roleValue}`, ephemeral: true });
        }
    }

    @SelectMenuComponent('role-other')
    async selectMenuOther(interaction: SelectMenuInteraction) {
        await interaction.deferReply({ ephemeral: true });

        const roleValue = interaction.values?.[0];

        if (!roleValue) { interaction.editReply({ content: `Erreur, value = ${roleValue}` }); return; }

        const user = interaction.user;

        const guild = interaction.guild;

        if (!guild) { interaction.editReply({ content: `Erreur, value = ${guild}` }); return; }

        switch (roleValue) {
            case 'membreUL':
                await this.assignRole(guild, user, RoleIDs.MEMBRE_UL, interaction);
                break;
            case 'teacher':
                const adminChannel = (interaction.guild.channels.resolve(ChannelIDs.ADMIN_CHANNEL));

                if (!adminChannel) { interaction.editReply({ content: `Erreur, adminChannel = ${adminChannel}` }); return; }

                if (!adminChannel.isText()) { interaction.editReply({ content: `Erreur, adminChannelType = ${adminChannel.type}` }); return; }

                await adminChannel.send(`${interaction.guild.roles.resolve(RoleIDs.ADMIN)} ! ${user} demande le grade ${interaction?.guild?.roles?.resolve(RoleIDs.ENSEIGNANT)}.`);
                interaction.followUp({ content: "Votre demande a bien été transmisse ! Étant donné les permissions attachées à ce rôle, il vous sera attribuée manuelle par un " + guild.roles.resolve(RoleIDs.ADMIN) + " après vérifications.", ephemeral: true });
                break;
            default:
                await interaction.followUp({ content: `Erreur, value = ${roleValue}`, ephemeral: true });
        }
    }

    @SelectMenuComponent('role-old-student')
    async selectMenuOldStudent(interaction: SelectMenuInteraction) {
        await interaction.deferReply({ ephemeral: true });

        const roleValue = interaction.values?.[0];

        if (!roleValue) { interaction.editReply({ content: `Erreur, value = ${roleValue}` }); return; }

        const user = interaction.user;

        const guild = interaction.guild;

        if (!guild) { interaction.editReply({ content: `Erreur, value = ${guild}` }); return; }

        switch (roleValue) {
            case 'old-lp-CIASIE':
                await this.assignRole(guild, user, RoleIDs.ANCIEN_LP_CIASIE, interaction);
                break;
            case 'old-DUT':
                await this.assignRole(guild, user, RoleIDs.ANCIEN_DUT, interaction);
                break;
            default:
                await interaction.followUp({ content: `Erreur, value = ${roleValue}`, ephemeral: true });
        }
    }

    private async assignRole(guild: Guild, user: User, roleID: RoleIDs, interaction: SelectMenuInteraction) {
        await guild?.members.resolve(user)?.roles.add(roleID);
        await interaction.followUp({ content: `Le rôle <@&${roleID}> a bien été assigné !`, ephemeral: true });
    }

    private async removeRole(guild: Guild, user: User, roleID: RoleIDs, interaction: SelectMenuInteraction) {
        await guild?.members.resolve(user)?.roles.remove(roleID);
        await interaction.followUp({ content: `Le rôle <@&${roleID}> a bien été retiré !`, ephemeral: true });
    }

    @Slash('messageRoleAlternant', { description: "Envoie le message permettant d'obtenir le rôle alternant" })
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
                    .addOptions([
                        {
                            label: "Oui",
                            description: "Je suis en alternance",
                            value: "oui"
                        },
                        {
                            label: "Non",
                            "description": "Je suis en formation classique",
                            value: "non"
                        }
                    ])
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

    @SelectMenuComponent('role-alternant')
    async selectMenuAlternant(interaction: SelectMenuInteraction){
        await interaction.deferReply({ ephemeral: true });

        const roleValue = interaction.values?.[0];

        if (!roleValue) { interaction.editReply({ content: `Erreur, value = ${roleValue}` }); return; }

        const user = interaction.user;

        const guild = interaction.guild;

        if (!guild) { interaction.editReply({ content: `Erreur, value = ${guild}` }); return; }

        switch (roleValue) {
            case 'oui':
                await this.assignRole(guild, user, RoleIDs.ALTERNANT, interaction);
                break;
            case 'non':
                await this.removeRole(guild, user, RoleIDs.ALTERNANT, interaction);
                break;
            default:
                await interaction.followUp({ content: `Erreur, value = ${roleValue}`, ephemeral: true });
        }
    }
}