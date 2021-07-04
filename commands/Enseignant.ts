import { DefaultPermission, Description, Discord, Guard, Guild, Option, Permission, Slash } from "@typeit/discord";
import { CommandInteraction, TextChannel, VoiceChannel } from "discord.js";
import { RoleIDs, ServerIDs } from "../enums/IDs";
import { categorieScolaireOnly } from "../guards/categorieScolaireOnly";

@Discord()
@Guild(ServerIDs.MAIN)
@DefaultPermission(false)
@Permission({ id: RoleIDs.ADMIN, type: 'ROLE', permission: true })
@Permission({ id: RoleIDs.STAR, type: 'ROLE', permission: true })
@Permission({ id: RoleIDs.ENSEIGNANT, type: 'ROLE', permission: true })
abstract class Teachers {
    @Slash('groupevocal')
    @Description("Crée un ou plusieurs salons vocaux temporaire dans cette catégorie (1 salon pendant 60m par défaut)")
    @Guard(categorieScolaireOnly)
    private async groupevocal(
        @Option('quantité', { description: "Nombre de salon à créer. (10 salon max)" })
        amount: number = 1,
        @Option('durée', { description: "Durée du salon avant sa suppression en minute. (240 minutes = 4 heures max)" })
        duration: number = 60,
        interaction: CommandInteraction
    ) {
        if (amount <= 0) { interaction.reply({ content: "Désolé cependant vous ne pouvez créer une quantité négative ou nulle de salon.", ephemeral: true }); return; }
        if (duration <= 0) { interaction.reply({ content: "Désolé cependant vous ne pouvez créer de salon pour une durée négative ou nulle.", ephemeral: true }); return; }

        if (amount > 10) { interaction.reply({ content: "Désolé cependant vous ne pouvez pas créer plus de 10 salons à la fois.", ephemeral: true }); return; }
        if (duration > 240) { interaction.reply({ content: "Désolé cependant vous ne pouvez créer de salon durant plus de 4 heures.", ephemeral: true }); return; }

        try { await interaction.defer(); } catch (error) { console.error(error); return; };

        const guild = interaction.guild;
        const category = (<TextChannel>interaction.channel).parent;
        let newSalonsPromise: Promise<VoiceChannel>[] = [];

        for (let i = 0; i < amount; i++) {
            newSalonsPromise.push(guild.channels.create(`💻・Groupe ${i + 1}`, { type: 'voice', parent: category, reason: `Salon vocal de groupe temporaire créé par ${interaction.user.username}` }));
        }

        interaction.editReply({ content: "Votre demande est en cours de traitement..." })

        const newChannels = await Promise.all(newSalonsPromise);

        newChannels.forEach(async salon => {
            salon.permissionOverwrites.create(interaction.user, { 'MANAGE_CHANNELS': true }, { reason: "Permissions données au créateur du salon" });
            setTimeout((salon: VoiceChannel) => {
                salon.delete(`Suppression du salon temporaire créé par ${interaction.user.username}`);
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