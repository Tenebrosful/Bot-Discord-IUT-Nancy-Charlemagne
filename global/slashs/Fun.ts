import { CommandInteraction, MessageActionRow, MessageButton } from "discord.js";
import { DefaultPermission, Discord, Slash, SlashChoice, SlashGroup, SlashOption } from "discordx";
import { pfcButtons, pfcChoix, pfcIsWin, pfcPlayBot, pfcProposition, pfcTraitementResultat } from "../../libs/pfc";

@Discord()
@SlashGroup("fun", "Commandes orienté sur l'amusement")
abstract class Fun {

    @Slash("pfc", { description: "Quoi de plus amusant que jouer à Pierre Feuille Ciseaux avec un robot ?" })
    async pfc(
        @SlashChoice(pfcChoix)
        @SlashOption("Choix", { description: "Que voulez-vous jouer ?" })
        choix: pfcChoix,
        interaction: CommandInteraction
    ) {
        if (choix) {
            await interaction.deferReply({ ephemeral: true });

            const choixJoueur = pfcProposition.nameToClass(choix);

            if (!choixJoueur) { interaction.editReply({ content: `Erreur, ${choix} est un choix invalide.` }); return; }

            const choixBot = pfcPlayBot();
            const resultat = pfcIsWin(choixJoueur, choixBot);

            if (!resultat) { interaction.editReply({ content: `Erreur, ${choixJoueur} vs ${choixBot} est un cas de figure non implémenté.` }); return; }

            interaction.editReply(pfcTraitementResultat(choixJoueur, choixBot, resultat, interaction.user));
        } else {
            await interaction.deferReply();

            const buttonRow = new MessageActionRow()
                .addComponents(pfcButtons);

            interaction.editReply({ content: "Ok let's go. 1v1 Pierre Feuille Ciseaux. Vas-y choisis !", components: [buttonRow] });
        }
    }
}