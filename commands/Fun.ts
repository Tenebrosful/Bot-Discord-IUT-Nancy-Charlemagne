import { randomInt } from "crypto";
import { ButtonInteraction, CommandInteraction, EmojiIdentifierResolvable, MessageActionRow, MessageButton, User } from "discord.js";
import { ButtonComponent, DefaultPermission, Discord, Slash, SlashChoice, SlashGroup, SlashOption } from "discordx";

enum pfcChoix {
    Pierre = "Pierre",
    Feuille = "Feuille",
    Ciseaux = "Ciseaux"
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

@Discord()
@DefaultPermission(true)
@SlashGroup("fun", "Commandes orienté sur l'amusement")
abstract class Fun {

    @Slash("pfc", { description: "Quoi de plus amusant que jouer à Pierre Feuille Ciseaux avec un robot ?" })
    async pfc(
        @SlashChoice(pfcChoix)
        @SlashOption("Choix", { description: "Que voulez-vous jouer ?" })
        choice: pfcChoix,
        interaction: CommandInteraction
    ) {

        if (choice) {
            await interaction.deferReply({ ephemeral: true });

            const playerChoice = pfcProposition.nameToClass(choice);

            if (!playerChoice) { interaction.editReply({ content: `Erreur, ${choice} est un choix invalide.` }); return; }

            const botChoice = Fun.pfcPlayBot();
            const result = Fun.isWin(playerChoice, botChoice);

            interaction.editReply(Fun.pfcTraitementResultat(playerChoice, botChoice, result, interaction.user));
        } else {
            await interaction.deferReply();

            const rockButton = new MessageButton()
                .setLabel("Pierre")
                .setEmoji('🪨')
                .setStyle('PRIMARY')
                .setCustomId('pfc-rock');

            const paperButton = new MessageButton()
                .setLabel("Feuille")
                .setEmoji('🧻')
                .setStyle('PRIMARY')
                .setCustomId('pfc-paper');

            const scissorButton = new MessageButton()
                .setLabel("Ciseaux")
                .setEmoji('✂️')
                .setStyle('PRIMARY')
                .setCustomId('pfc-scissors');

            const wellButton = new MessageButton()
                .setLabel("Puit")
                .setEmoji('❓')
                .setStyle('PRIMARY')
                .setCustomId('pfc-well')
                .setDisabled(true);

            const buttonRow = new MessageActionRow()
                .addComponents(rockButton, paperButton, scissorButton, wellButton);

            interaction.editReply({ content: "Ok let's go. 1v1 Pierre Feuille Ciseaux. Vas-y choisis !", components: [buttonRow] });
        }
    }

    @ButtonComponent('pfc-rock')
    @ButtonComponent('pfc-paper')
    @ButtonComponent('pfc-scissors')
    private async pfcButton(interaction: ButtonInteraction) {
        const playerChoice = pfcProposition.buttonCustomIDToClass(interaction.customId);

        if (!playerChoice) { interaction.reply({ content: `Erreur, ${interaction.customId} est un choix invalide.`, ephemeral: true }); return; }

        const botChoice = Fun.pfcPlayBot();
        const result = Fun.isWin(playerChoice, botChoice);

        interaction.update(Fun.pfcTraitementResultat(playerChoice, botChoice, result, interaction.user));
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
        return pfcProposition.propositions[randomInt(pfcProposition.propositions.length)];
    }

    private static pfcTraitementResultat(choix: pfcProposition, choixBot: pfcProposition, resultat: pfcResultat, player: User) {
        switch (resultat) {
            case pfcResultat.WIN:
                return { content: `(${player}) ${choixBot.emoji} ${choixBot.name} ! Well, noob ${choix.emoji} ${choix.name} need nerf plz...` };
            case pfcResultat.LOOSE:
                return { content: `(${player}) ${choixBot.emoji} ${choixBot.name} ! GG NO RE, EZ !` };
            case pfcResultat.DRAW:
                return { content: `(${player}) ${choixBot.emoji} ${choixBot.name} ! Ha... Égalité...` };
        }
    }
}