import { Guild, SelectMenuInteraction, User } from "discord.js";
import { Discord, SelectMenuComponent } from "discordx";
import { Role, Salon } from "../IDs";

@Discord()
abstract class Roles {

    @SelectMenuComponent('role-lp')
    async roleLP(interaction: SelectMenuInteraction) {
        await interaction.deferReply({ ephemeral: true });

        const roleValue = interaction.values?.[0];

        if (!roleValue) { interaction.editReply({ content: `Erreur, value = ${roleValue}` }); return; }

        const user = interaction.user;

        const guild = interaction.guild;

        if (!guild) { interaction.editReply({ content: `Erreur, value = ${guild}` }); return; }

        switch (roleValue) {
            case 'lp-ACORS':
                await this.assignRole(guild, user, Role.LP_ACORS, interaction);
                await this.assignRole(guild, user, Role.ÉTUDIANT, interaction);
                break;
            case 'lp-AFTER':
                await this.assignRole(guild, user, Role.LP_AFTER, interaction);
                await this.assignRole(guild, user, Role.ÉTUDIANT, interaction);
                break;
            case 'lp-CIASIE-1':
                await this.assignRole(guild, user, Role.LP_CIASIE, interaction);
                await this.assignRole(guild, user, Role.LP_CIASIE_1, interaction);
                await this.assignRole(guild, user, Role.ÉTUDIANT, interaction);
                break;
            case 'lp-CIASIE-2':
                await this.assignRole(guild, user, Role.LP_CIASIE, interaction);
                await this.assignRole(guild, user, Role.LP_CIASIE_2, interaction);
                await this.assignRole(guild, user, Role.ÉTUDIANT, interaction);
                break;
            default:
                await interaction.followUp({ content: `Erreur, value = ${roleValue}`, ephemeral: true });
        }
    }

    @SelectMenuComponent('role-but-1a')
    async roleBUT1A(interaction: SelectMenuInteraction) {
        await interaction.deferReply({ ephemeral: true });

        const roleValue = interaction.values?.[0];

        if (!roleValue) { interaction.editReply({ content: `Erreur, value = ${roleValue}` }); return; }

        const user = interaction.user;

        const guild = interaction.guild;

        if (!guild) { interaction.editReply({ content: `Erreur, value = ${guild}` }); return; }

        switch (roleValue) {
            case 'but-1A-a':
                await this.assignRole(guild, user, Role.BUT_1A, interaction);
                await this.assignRole(guild, user, Role.BUT_1A_A, interaction);
                await this.assignRole(guild, user, Role.ÉTUDIANT, interaction);
                break;
            case 'but-1A-b':
                await this.assignRole(guild, user, Role.BUT_1A, interaction);
                await this.assignRole(guild, user, Role.BUT_1A_B, interaction);
                await this.assignRole(guild, user, Role.ÉTUDIANT, interaction);
                break;
            case 'but-1A-c':
                await this.assignRole(guild, user, Role.BUT_1A, interaction);
                await this.assignRole(guild, user, Role.BUT_1A_C, interaction);
                await this.assignRole(guild, user, Role.ÉTUDIANT, interaction);
                break;
            case 'but-1A-d':
                await this.assignRole(guild, user, Role.BUT_1A, interaction);
                await this.assignRole(guild, user, Role.BUT_1A_D, interaction);
                await this.assignRole(guild, user, Role.ÉTUDIANT, interaction);
                break;
            case 'but-1A-e':
                await this.assignRole(guild, user, Role.BUT_1A, interaction);
                await this.assignRole(guild, user, Role.BUT_1A_E, interaction);
                await this.assignRole(guild, user, Role.ÉTUDIANT, interaction);
                break;
            default:
                await interaction.followUp({ content: `Erreur, value = ${roleValue}`, ephemeral: true });
        }
    }

    @SelectMenuComponent('role-dut-2a')
    async roleDUT2A(interaction: SelectMenuInteraction) {
        await interaction.deferReply({ ephemeral: true });

        const roleValue = interaction.values?.[0];

        if (!roleValue) { interaction.editReply({ content: `Erreur, value = ${roleValue}` }); return; }

        const user = interaction.user;

        const guild = interaction.guild;

        if (!guild) { interaction.editReply({ content: `Erreur, value = ${guild}` }); return; }

        switch (roleValue) {
            case 'dut-2A-a':
                await this.assignRole(guild, user, Role.DUT_2A, interaction);
                await this.assignRole(guild, user, Role.DUT_2A_A, interaction);
                await this.assignRole(guild, user, Role.ÉTUDIANT, interaction);
                break;
            case 'dut-2A-b':
                await this.assignRole(guild, user, Role.DUT_2A, interaction);
                await this.assignRole(guild, user, Role.DUT_2A_B, interaction);
                await this.assignRole(guild, user, Role.ÉTUDIANT, interaction);
                break;
            case 'dut-2A-c':
                await this.assignRole(guild, user, Role.DUT_2A, interaction);
                await this.assignRole(guild, user, Role.DUT_2A_C, interaction);
                await this.assignRole(guild, user, Role.ÉTUDIANT, interaction);
                break;
            case 'dut-2A-d':
                await this.assignRole(guild, user, Role.DUT_2A, interaction);
                await this.assignRole(guild, user, Role.DUT_2A_D, interaction);
                await this.assignRole(guild, user, Role.ÉTUDIANT, interaction);
                break;
            default:
                await interaction.followUp({ content: `Erreur, value = ${roleValue}`, ephemeral: true });
        }
    }

    @SelectMenuComponent('role-other')
    async roleAutre(interaction: SelectMenuInteraction) {
        await interaction.deferReply({ ephemeral: true });

        const roleValue = interaction.values?.[0];

        if (!roleValue) { interaction.editReply({ content: `Erreur, value = ${roleValue}` }); return; }

        const user = interaction.user;

        const guild = interaction.guild;

        if (!guild) { interaction.editReply({ content: `Erreur, value = ${guild}` }); return; }

        switch (roleValue) {
            case 'membreUL':
                await this.assignRole(guild, user, Role.MEMBRE_UL, interaction);
                break;
            case 'teacher':
                const adminChannel = (interaction.guild.channels.resolve(Salon.ADMIN_CHANNEL));

                if (!adminChannel) { interaction.editReply({ content: `Erreur, adminChannel = ${adminChannel}` }); return; }

                if (!adminChannel.isText()) { interaction.editReply({ content: `Erreur, adminChannelType = ${adminChannel.type}` }); return; }

                await adminChannel.send(`${interaction.guild.roles.resolve(Role.ADMIN)} ! ${user} demande le grade ${interaction?.guild?.roles?.resolve(Role.ENSEIGNANT)}.`);
                interaction.followUp({ content: "Votre demande a bien été transmisse ! Étant donné les permissions attachées à ce rôle, il vous sera attribuée manuelle par un " + guild.roles.resolve(Role.ADMIN) + " après vérifications.", ephemeral: true });
                break;
            default:
                await interaction.followUp({ content: `Erreur, value = ${roleValue}`, ephemeral: true });
        }
    }

    @SelectMenuComponent('role-old-student')
    async RoleAncien(interaction: SelectMenuInteraction) {
        await interaction.deferReply({ ephemeral: true });

        const roleValue = interaction.values?.[0];

        if (!roleValue) { interaction.editReply({ content: `Erreur, value = ${roleValue}` }); return; }

        const user = interaction.user;

        const guild = interaction.guild;

        if (!guild) { interaction.editReply({ content: `Erreur, value = ${guild}` }); return; }

        switch (roleValue) {
            case 'old-lp-CIASIE':
                await this.assignRole(guild, user, Role.ANCIEN_LP_CIASIE, interaction);
                break;
            case 'old-DUT':
                await this.assignRole(guild, user, Role.ANCIEN_DUT, interaction);
                break;
            default:
                await interaction.followUp({ content: `Erreur, value = ${roleValue}`, ephemeral: true });
        }
    }

    private async assignRole(guild: Guild, user: User, roleID: Role, interaction: SelectMenuInteraction) {
        await guild?.members.resolve(user)?.roles.add(roleID);
        await interaction.followUp({ content: `Le rôle <@&${roleID}> a bien été assigné !`, ephemeral: true });
    }

    private async removeRole(guild: Guild, user: User, roleID: Role, interaction: SelectMenuInteraction) {
        await guild?.members.resolve(user)?.roles.remove(roleID);
        await interaction.followUp({ content: `Le rôle <@&${roleID}> a bien été retiré !`, ephemeral: true });
    }

    @SelectMenuComponent('role-alternant')
    async selectMenuAlternant(interaction: SelectMenuInteraction) {
        await interaction.deferReply({ ephemeral: true });

        const roleValue = interaction.values?.[0];

        if (!roleValue) { interaction.editReply({ content: `Erreur, value = ${roleValue}` }); return; }

        const user = interaction.user;

        const guild = interaction.guild;

        if (!guild) { interaction.editReply({ content: `Erreur, value = ${guild}` }); return; }

        switch (roleValue) {
            case 'oui':
                await this.assignRole(guild, user, Role.ALTERNANT, interaction);
                break;
            case 'non':
                await this.removeRole(guild, user, Role.ALTERNANT, interaction);
                break;
            default:
                await interaction.followUp({ content: `Erreur, value = ${roleValue}`, ephemeral: true });
        }
    }
}

export const RolesLPOptions = [
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
    }
];

export const RolesBUT1AOptions = [
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
];

export const RolesDUT2AOptions = [
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
];

export const RolesAutreOptions = [
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
];

export const RolesAncienOptions = [
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
];

export const RoleAlternantCIASIEOptions = [
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
]