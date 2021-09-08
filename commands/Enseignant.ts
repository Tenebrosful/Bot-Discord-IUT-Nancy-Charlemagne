import { CommandInteraction, VoiceChannel } from "discord.js";
import { DefaultPermission, Discord, Guild, Permission, Slash, SlashOption } from "discordx";
import { RoleIDs, ServerIDs } from "../enums/IDs";

@Discord()
@Guild(ServerIDs.MAIN)
@DefaultPermission(false)
@Permission({ id: RoleIDs.ADMIN, type: 'ROLE', permission: true })
@Permission({ id: RoleIDs.STAR, type: 'ROLE', permission: true })
@Permission({ id: RoleIDs.ENSEIGNANT, type: 'ROLE', permission: true })
abstract class Enseignant {
    
    @Slash('groupevocal', { description: "Crée un ou plusieurs salons vocaux temporaire dans cette catégorie (1 salon pendant 60m par défaut)" })
    private async groupevocal(
        @SlashOption('quantité', { description: "Nombre de salon à créer. (10 salon max)" })
        amount: number = 1,
        @SlashOption('durée', { description: "Durée du salon avant sa suppression en minute. (240 minutes = 4 heures max)" })
        duration: number = 60,
        interaction: CommandInteraction
    ) {
        if (amount <= 0) { interaction.reply({ content: "Désolé cependant vous ne pouvez créer une quantité négative ou nulle de salon.", ephemeral: true }); return; }
        if (duration <= 0) { interaction.reply({ content: "Désolé cependant vous ne pouvez créer de salon pour une durée négative ou nulle.", ephemeral: true }); return; }

        if (amount > 10) { interaction.reply({ content: "Désolé cependant vous ne pouvez pas créer plus de 10 salons à la fois.", ephemeral: true }); return; }
        if (duration > 240) { interaction.reply({ content: "Désolé cependant vous ne pouvez créer de salon durant plus de 4 heures.", ephemeral: true }); return; }

        if (interaction.channel?.type !== "GUILD_TEXT") { return; }

        const category = interaction.channel?.parent;

        if (!category) { interaction.reply({ content: "Désolé cependant ce salon n'a pas de catégorie.", ephemeral: true }); return; }

        const guild = interaction.guild;

        if (!guild) { interaction.reply({ content: `Une erreur est survenue (guild: ${guild})`, ephemeral: true }); return; }

        await interaction.deferReply();

        let newSalonsPromise: Promise<VoiceChannel>[] = [];

        for (let i = 0; i < amount; i++) {
            newSalonsPromise.push(guild.channels.create(`💻・Groupe ${i + 1}`, {
                type: "GUILD_VOICE",
                parent: category,
                reason: `Salon vocal de groupe temporaire créé par ${interaction.user.username}`
            }));
        }

        interaction.editReply({ content: "Votre demande est en cours de traitement..." })

        const newChannels = await Promise.all(newSalonsPromise);

        newChannels.forEach(async salon => {
            salon.permissionOverwrites.create(interaction.user, { 'MANAGE_CHANNELS': true }, { reason: "Permissions données au créateur du salon" });
            setTimeout((salon: VoiceChannel) => {
                salon.delete();
            }, duration * 60000, salon);
        });

        interaction.editReply({ content: `Vos ${amount} salons ont été créé pour ${duration} minutes. \`${duration} minutes restantes\`` });

        let minutesSpend = 0;
        const intervalID = setInterval(
            (interaction: CommandInteraction, minutesSpend: number) => {
                interaction.editReply({ content: `Vos ${amount} salons ont été créé pour ${duration} minutes. \`${duration - minutesSpend} minutes restantes\`` });
                minutesSpend++
            }, 60000, interaction, ++minutesSpend);

        setTimeout((intervalID, interaction: CommandInteraction) => { clearInterval(intervalID); interaction.editReply({ content: `Temps écoulé ! Vos salons ont été supprimés.` }) }, duration * 60000, intervalID, interaction);
    }
}