import { Button, Choices, DefaultPermission, Description, Discord, Option, Slash } from "@typeit/discord";
import { randomInt } from "crypto";
import { ButtonInteraction, CommandInteraction, EmojiIdentifierResolvable, MessageActionRow, MessageButton } from "discord.js";

enum pfcChoix {
    Pierre = "Rock",
    Feuille = "Paper",
    Ciseaux = "Scissors"
}

enum pfcResultat {
    WIN,
    LOOSE,
    DRAW
}

class pfcProposition {
    public static propositions = [
        new pfcProposition(pfcChoix.Pierre, '🪨', 'pfc-rock'),
        new pfcProposition(pfcChoix.Feuille, '🧻', 'pfc-paper'),
        new pfcProposition(pfcChoix.Ciseaux, '✂️', 'pfc-scissors')
    ]

    public name: pfcChoix;
    public emoji: EmojiIdentifierResolvable;
    public buttonCustomID: "pfc-rock" | "pfc-paper" | "pfc-scissors";

    constructor(nom: pfcChoix, emoji: EmojiIdentifierResolvable, buttonCustomID: "pfc-rock" | "pfc-paper" | "pfc-scissors") {
        this.name = nom;
        this.emoji = emoji;
        this.buttonCustomID = buttonCustomID;
    }

    public static nameToClass(nom: string) {
        return this.propositions.find(proposition => nom === proposition.name);
    }

    public static buttonCustomIDToClass(buttonCustomID: string) {
        return this.propositions.find(proposition => buttonCustomID === proposition.buttonCustomID);
    }
}

@DefaultPermission(true)
@Discord()
abstract class Fun {
    @Slash('pfc')
    @Description("Quoi de plus amusant que jouer à Pierre Feuille Ciseaux avec un robot ?")
    private async pfc(
        @Choices(pfcChoix)
        @Option('Choix', { description: "Votre choix. Si vous ne choisissez pas vous aurez des boutons à disposition pour choisir et jouer" })
        choice: pfcChoix,
        interaction: CommandInteraction
    ) {
        await interaction.defer();

        if (choice) {
            const playerChoice = pfcProposition.nameToClass(choice);
            const botChoice = Fun.pfcPlayBot();
            const result = Fun.isWin(playerChoice, botChoice);

            interaction.editReply(Fun.pfcTraitementResultat(playerChoice, botChoice, result))
        } else {
            const rockButton = new MessageButton()
                .setLabel("Pierre")
                .setEmoji('🪨')
                .setStyle('PRIMARY')
                .setCustomID('pfc-rock');

            const paperButton = new MessageButton()
                .setLabel("Feuille")
                .setEmoji('🧻')
                .setStyle('PRIMARY')
                .setCustomID('pfc-paper');

            const scissorButton = new MessageButton()
                .setLabel("Ciseaux")
                .setEmoji('✂️')
                .setStyle('PRIMARY')
                .setCustomID('pfc-scissors');

            const wellButton = new MessageButton()
                .setLabel("Puit")
                .setEmoji('❓')
                .setStyle('PRIMARY')
                .setCustomID('pfc-well')
                .setDisabled(true);

            const buttonRow = new MessageActionRow()
                .addComponents(rockButton, paperButton, scissorButton, wellButton);

            interaction.editReply({ content: "Ok let's go. 1v1 Pierre Feuille Ciseaux. Vas-y choisis !", components: [buttonRow] });

            setTimeout(interaction => interaction.deleteReply(), 600000, interaction);
        }
    }

    @Button('pfc-rock')
    @Button('pfc-paper')
    @Button('pfc-scissors')
    private async pfcButton(interaction: ButtonInteraction) {
        await interaction.defer();

        const playerChoice = pfcProposition.buttonCustomIDToClass(interaction.customID);
        const botChoice = Fun.pfcPlayBot();
        const result = Fun.isWin(playerChoice, botChoice);

        interaction.editReply(Fun.pfcTraitementResultat(playerChoice, botChoice, result));

        setTimeout(interaction => { try { interaction.deleteReply() } catch (err) { console.error(err) } }, 30000, interaction);
    }

    private static isWin(playerChoice: pfcProposition, botChoice: pfcProposition): pfcResultat {
        switch (playerChoice.name) {
            case pfcChoix.Pierre:
                if (botChoice.name === pfcChoix.Ciseaux) return pfcResultat.WIN;
                if (botChoice.name === pfcChoix.Feuille) return pfcResultat.LOOSE;
                return pfcResultat.DRAW;
            case pfcChoix.Feuille:
                if (botChoice.name === pfcChoix.Pierre) return pfcResultat.WIN;
                if (botChoice.name === pfcChoix.Ciseaux) return pfcResultat.LOOSE;
                return pfcResultat.DRAW;
            case pfcChoix.Ciseaux:
                if (botChoice.name === pfcChoix.Feuille) return pfcResultat.WIN;
                if (botChoice.name === pfcChoix.Pierre) return pfcResultat.LOOSE;
                return pfcResultat.DRAW;
        }
    }

    private static pfcPlayBot(): pfcProposition {
        return pfcProposition.propositions[randomInt(3)];
    }

    private static pfcTraitementResultat(choix: pfcProposition, choixBot: pfcProposition, resultat: pfcResultat) {
        switch (resultat) {
            case pfcResultat.WIN:
                return { content: `${choixBot.emoji} ${choixBot.name} ! Well, noob ${choix.emoji} ${choix.name} need nerf plz...` };
            case pfcResultat.LOOSE:
                return { content: `${choixBot.emoji} ${choixBot.name} ! GG NO RE, EZ !` };
            case pfcResultat.DRAW:
                return { content: `${choixBot.emoji} ${choixBot.name} ! Ha... Égalité...` };
        }
    }
}
