import { Button, Choices, DefaultPermission, Description, Discord, Option, Slash } from "@typeit/discord";
import { randomInt } from "crypto";
import { ButtonInteraction, CommandInteraction, EmojiIdentifierResolvable, MessageActionRow, MessageButton } from "discord.js";

enum pfcChoix {
    Pierre = "Pierre",
    Feuille = "Feuille",
    Ciseaux = "Ciseaux"
}

enum pfcResultat {
    GAGNÉ,
    PERDU,
    ÉGALITÉ
}

class pfcProposition {
    public static propositions = [
        new pfcProposition(pfcChoix.Pierre, '🪨', 'pfc-pierre'),
        new pfcProposition(pfcChoix.Feuille, '🧻', 'pfc-feuille'),
        new pfcProposition(pfcChoix.Ciseaux, '✂️', 'pfc-ciseaux')
    ]

    public nom: pfcChoix;
    public emoji: EmojiIdentifierResolvable;
    public buttonCustomID: "pfc-pierre" | "pfc-feuille" | "pfc-ciseaux";

    constructor(nom: pfcChoix, emoji: EmojiIdentifierResolvable, buttonCustomID: "pfc-pierre" | "pfc-feuille" | "pfc-ciseaux") {
        this.nom = nom;
        this.emoji = emoji;
        this.buttonCustomID = buttonCustomID;
    }

    public static nameToClass(nom: string) {
        return this.propositions.find(proposition => nom === proposition.nom);
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
        choix: pfcChoix,
        interaction: CommandInteraction
    ) {
        await interaction.defer();

        if (choix) {
            const choixJoueur = pfcProposition.nameToClass(choix);
            const choixBot = Fun.pfcPlayBot();
            const resultat = Fun.isWinPfc(choixJoueur, choixBot);

            interaction.editReply(Fun.pfcTraitementResultat(choixJoueur, choixBot, resultat))
        } else {
            const boutonPierre = new MessageButton()
                .setLabel("Pierre")
                .setEmoji('🪨')
                .setStyle('PRIMARY')
                .setCustomID('pfc-pierre');

            const boutonFeuille = new MessageButton()
                .setLabel("Feuille")
                .setEmoji('🧻')
                .setStyle('PRIMARY')
                .setCustomID('pfc-feuille');

            const boutonCiseaux = new MessageButton()
                .setLabel("Ciseaux")
                .setEmoji('✂️')
                .setStyle('PRIMARY')
                .setCustomID('pfc-ciseaux');

            const boutonPuit = new MessageButton()
                .setLabel("Puit")
                .setEmoji('❓')
                .setStyle('PRIMARY')
                .setCustomID('pfc-puit')
                .setDisabled(true);

            const buttonRow = new MessageActionRow()
                .addComponents(boutonPierre, boutonFeuille, boutonCiseaux, boutonPuit);

            interaction.editReply({ content: "Ok let's go. 1v1 Pierre Feuille Ciseaux. Vas-y choisis !", components: [buttonRow] });

            setTimeout(interaction => interaction.deleteReply(), 600000, interaction);
        }
    }

    @Button('pfc-pierre')
    @Button('pfc-feuille')
    @Button('pfc-ciseaux')
    private async pfcButton(interaction: ButtonInteraction) {
        await interaction.defer();

        const choix = pfcProposition.buttonCustomIDToClass(interaction.customID);
        const choixBot = Fun.pfcPlayBot();
        const resultat = Fun.isWinPfc(choix, choixBot);

        interaction.editReply(Fun.pfcTraitementResultat(choix, choixBot, resultat));

        setTimeout(interaction => { try { interaction.deleteReply() } catch (err) { console.error(err) } }, 30000, interaction);
    }

    private static isWinPfc(joueur: pfcProposition, bot: pfcProposition): pfcResultat {
        switch (joueur.nom) {
            case pfcChoix.Pierre:
                if (bot.nom === pfcChoix.Ciseaux) return pfcResultat.GAGNÉ;
                if (bot.nom === pfcChoix.Feuille) return pfcResultat.PERDU;
                return pfcResultat.ÉGALITÉ;
            case pfcChoix.Feuille:
                if (bot.nom === pfcChoix.Pierre) return pfcResultat.GAGNÉ;
                if (bot.nom === pfcChoix.Ciseaux) return pfcResultat.PERDU;
                return pfcResultat.ÉGALITÉ;
            case pfcChoix.Ciseaux:
                if (bot.nom === pfcChoix.Feuille) return pfcResultat.GAGNÉ;
                if (bot.nom === pfcChoix.Pierre) return pfcResultat.PERDU;
                return pfcResultat.ÉGALITÉ;
        }
    }

    private static pfcPlayBot(): pfcProposition {
        return pfcProposition.propositions[randomInt(3)];
    }

    private static pfcTraitementResultat(choix: pfcProposition, choixBot: pfcProposition, resultat: pfcResultat) {
        switch (resultat) {
            case pfcResultat.GAGNÉ:
                return { content: `${choixBot.emoji} ${choixBot.nom} ! Well, noob ${choix.emoji} ${choix.nom} need nerf plz...` };
            case pfcResultat.PERDU:
                return { content: `${choixBot.emoji} ${choixBot.nom} ! GG NO RE, EZ !` };
            case pfcResultat.ÉGALITÉ:
                return { content: `${choixBot.emoji} ${choixBot.nom} ! Ha... Égalité...` };
        }
    }
}
