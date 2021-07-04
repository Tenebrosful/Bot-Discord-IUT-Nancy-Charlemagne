import { DefaultPermission, Description, Discord, Guild, Permission, SelectMenu, Slash } from "@typeit/discord";
import { CommandInteraction, MessageActionRow, MessageSelectMenu, SelectMenuInteraction, TextChannel } from "discord.js";
import { ChannelIDs, RoleIDs, ServerIDs } from "../enums/IDs";

@Discord()
@Guild(ServerIDs.MAIN)
@DefaultPermission(false)
@Permission({id: RoleIDs.ADMIN, type: 'ROLE', permission: true})
@Permission({id: RoleIDs.STAR, type: 'ROLE', permission: true})
abstract class Role {
    @Slash('messageroles')
    @Description("Envoie le message permettant d'obtenir les rôles")
    private async messageroles(interaction: CommandInteraction) {
        await interaction.defer({ ephemeral: true });
        const channel = interaction.channel;

        if (!channel.isText()) interaction.reply("Type de salon inattendu.");

        const selectMain = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setCustomID('role-main')
                    .addOptions([
                        {
                            label: "Licenses Pro.",
                            value: "lp",
                            description: "Vous êtes en Licenses Professionnelle ?"
                        },
                        {
                            label: "DUT 1ère Année",
                            value: "dut-1A",
                            description: "Vous êtes en 1ère Année de DUT ?"
                        },
                        {
                            label: "DUT 2ème Année",
                            value: "dut-2A",
                            description: "Vous êtes en 2ème Année de DUT ?"
                        },
                        {
                            label: "DUT Année Spéciale",
                            value: "dut-AS",
                            description: "Vous êtes en Année Spéciale de DUT ?"
                        },
                        {
                            label: "Enseignant",
                            value: "enseignant",
                            description: "Vous êtes Enseignant ?"
                        }
                    ])
            );

        try {
            await channel.send({ content: "Bienvenue sur le Serveur du Département Informatique de l'IUT Nancy-Charlemagne ! Veuillez sélectionner ce qui vous correspondant via le menu juste en dessous.", components: [selectMain] });
        } catch (err) {
            interaction.editReply({ content: "Une erreur est survenue." });
            console.log(err)
        } finally {
            interaction.editReply({ content: "Done." });
        }
    }

    @SelectMenu('role-main')
    private async roleMain(interaction: SelectMenuInteraction) {
        const selected = interaction.values[0];

        switch (selected) {
            case "enseignant":
                const channel = (<TextChannel>interaction.guild.channels.resolve(ChannelIDs.ADMIN_CHANNEL));

                if (channel === null) {
                    console.log(`Null Channel`)
                    interaction.reply({ content: "Une erreure est survenue.", ephemeral: true });
                }

                channel.send(`${(await interaction.guild.fetchOwner()).toString()} ! ${interaction.user.toString()} demande le grade ${interaction.guild.roles.resolve(RoleIDs.COMPTE_SECONDAIRE).toString()}. (Enseignant mais pour les test je retire les potentiels ping du grade désolé)`);
                interaction.reply({ content: "Votre demande a bien été transmisse !", ephemeral: true });
                break;
        }
    }
}