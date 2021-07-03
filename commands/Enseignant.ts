import { Description, Discord, Guard, Guild, Option, Permission, Slash } from "@typeit/discord";
import { CommandInteraction, TextChannel, VoiceChannel } from "discord.js";
import { RoleIDs, ServerIDs } from "../enums/IDs";
import { categorieScolaireOnly } from "../guards/categorieScolaireOnly";

@Discord()
@Guild(ServerIDs.MAIN)
@Permission(RoleIDs.ADMIN, 'ROLE')
@Permission(RoleIDs.STAR, 'ROLE')
@Permission(RoleIDs.ENSEIGNANT, 'ROLE')
abstract class Enseignant {
    @Slash('groupevocal')
    @Description("Crée un ou plusieurs salons vocaux temporaire dans cette catégorie (1 salon pendant 60m par défaut)")
    @Guard(categorieScolaireOnly)
    private async groupevocal(
        @Option('quantité', { description: "Nombre de salon à créer. (10 salon max)" })
        quantite: number = 1,
        @Option('durée', { description: "Durée du salon avant sa suppression en minute. (240 minutes = 4 heures max)" })
        duree: number = 60,
        interaction: CommandInteraction
    ) {
        if (quantite <= 0) { interaction.reply({ content: "Désolé cependant vous ne pouvez créer une quantité négative ou nulle de salon.", ephemeral: true }); return; }
        if (duree <= 0) { interaction.reply({ content: "Désolé cependant vous ne pouvez créer de salon pour une durée négative ou nulle.", ephemeral: true }); return; }

        if (quantite > 10) { interaction.reply({ content: "Désolé cependant vous ne pouvez pas créer plus de 10 salons à la fois.", ephemeral: true }); return; }
        if (duree > 240) { interaction.reply({ content: "Désolé cependant vous ne pouvez créer de salon durant plus de 4 heures.", ephemeral: true }); return; }

        interaction.defer();

        const guild = interaction.guild;
        const categorie = (<TextChannel>interaction.channel).parent;
        let newSalonsPromise: Promise<VoiceChannel>[] = [];

        for (let i = 0; i < quantite; i++) {
            newSalonsPromise.push(guild.channels.create(`💻・Groupe ${i + 1}`, { type: 'voice', parent: categorie, reason: `Salon vocal de groupe temporaire créé par ${interaction.user.username}` }));
        }

        interaction.editReply({ content: "Votre demande est en cours de traitement..." })

        const newSalons = await Promise.all(newSalonsPromise);

        newSalons.forEach(async salon => {
            salon.createOverwrite(interaction.user, { 'MANAGE_CHANNELS': true });
            setTimeout((salon: VoiceChannel) => {
                salon.delete(`Suppression du salon temporaire créé par ${interaction.user.username}`);
            }, duree * 60000, salon);
        });

        interaction.editReply({ content: `Vos ${quantite} salons ont été créé pour ${duree} minutes. \`${duree} minutes restantes\`` });

        let minutesEcoules = 0;
        const intervalID = setInterval(
            (interaction: CommandInteraction, minutesEcoules: number) => {
                interaction.editReply({ content: `Vos ${quantite} salons ont été créé pour ${duree} minutes. \`${duree - minutesEcoules} minutes restantes\`` });
                minutesEcoules++
            }, 60000, interaction, ++minutesEcoules);

        setTimeout((intervalID, interaction: CommandInteraction) => { clearInterval(intervalID); interaction.editReply({ content: `Temps écoulé ! Vos salons ont été supprimés.` }) }, duree * 60000, intervalID, interaction);
    }
}