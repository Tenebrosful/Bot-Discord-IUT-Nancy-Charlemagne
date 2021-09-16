import { ButtonInteraction } from "discord.js";
import { ButtonComponent, Discord } from "discordx";
import { pfcIsWin, pfcPlayBot, pfcProposition, pfcTraitementResultat } from "../../libs/pfc";

@Discord()
abstract class Pfc {

    @ButtonComponent('pfc-rock')
    @ButtonComponent('pfc-paper')
    @ButtonComponent('pfc-scissors')
    private async pfcButton(interaction: ButtonInteraction) {
        const playerChoice = pfcProposition.buttonCustomIdToClass(interaction.customId);

        if (!playerChoice) { interaction.reply({ content: `Erreur, ${interaction.customId} est un choix invalide.`, ephemeral: true }); return; }

        const botChoice = pfcPlayBot();
        const result = pfcIsWin(playerChoice, botChoice);

        if (!result) { interaction.editReply({ content: `Erreur, ${playerChoice} vs ${botChoice} est un cas de figure non implémenté.` }); return; }

        interaction.update(pfcTraitementResultat(playerChoice, botChoice, result, interaction.user));
    }
}