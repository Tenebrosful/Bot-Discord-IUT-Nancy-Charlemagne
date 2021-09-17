import { randomInt } from "crypto";
import { EmojiIdentifierResolvable, MessageButton, User } from "discord.js";

export enum pfcChoix {
    Pierre = "Pierre",
    Feuille = "Feuille",
    Ciseaux = "Ciseaux",
    Puit = "Puit"
}

export enum pfcEmoji {
    Pierre = "🪨",
    Feuille = "🧻",
    Ciseaux = "✂️",
    Puit = "❓"
}

export enum pfcButtonId {
    Pierre = "pfc-pierre",
    Feuille = "pfc-feuille",
    Ciseaux = "pfc-ciseaux",
    Puit = "pfc-puit"
}

export const pfcButtons: MessageButton[] = [
    new MessageButton()
        .setLabel(pfcChoix.Pierre)
        .setEmoji(pfcEmoji.Pierre)
        .setStyle('PRIMARY')
        .setCustomId(pfcButtonId.Pierre),
    new MessageButton()
        .setLabel(pfcChoix.Feuille)
        .setEmoji(pfcEmoji.Feuille)
        .setStyle('PRIMARY')
        .setCustomId(pfcButtonId.Feuille),
    new MessageButton()
        .setLabel(pfcChoix.Ciseaux)
        .setEmoji(pfcEmoji.Ciseaux)
        .setStyle('PRIMARY')
        .setCustomId(pfcButtonId.Ciseaux),
    new MessageButton()
        .setLabel(pfcChoix.Puit)
        .setEmoji(pfcEmoji.Puit)
        .setStyle('PRIMARY')
        .setCustomId(pfcButtonId.Puit)
];

export enum pfcResultat {
    GAGNÉ,
    PERDU,
    ÉGALITÉ
}

export class pfcProposition {
    public nom: pfcChoix;
    public emoji: EmojiIdentifierResolvable;
    public buttonCustomId: pfcButtonId;

    public static propositions = [
        new pfcProposition(pfcChoix.Pierre, pfcEmoji.Pierre, pfcButtonId.Pierre),
        new pfcProposition(pfcChoix.Feuille, pfcEmoji.Feuille, pfcButtonId.Feuille),
        new pfcProposition(pfcChoix.Ciseaux, pfcEmoji.Ciseaux, pfcButtonId.Ciseaux)
    ]

    constructor(nom: pfcChoix, emoji: EmojiIdentifierResolvable, buttonCustomId: pfcButtonId) {
        this.nom = nom;
        this.emoji = emoji;
        this.buttonCustomId = buttonCustomId;
    }

    public static nameToClass(nom: string): pfcProposition | undefined {
        return this.propositions.find(proposition => nom === proposition.nom);
    }

    public static buttonCustomIdToClass(buttonCustomId: string): pfcProposition | undefined {
        return this.propositions.find(proposition => buttonCustomId === proposition.buttonCustomId);
    }

    public toString() {
        return `${this.emoji} ${this.nom}`;
    }
}

export function pfcIsWin(choixJoueur: pfcProposition, choixBot: pfcProposition): pfcResultat | undefined {
    if (choixBot.nom === choixJoueur.nom) return pfcResultat.ÉGALITÉ;

    switch (choixJoueur.nom) {
        case pfcChoix.Pierre:
            if (choixBot.nom === pfcChoix.Ciseaux) return pfcResultat.GAGNÉ;
            if (choixBot.nom === pfcChoix.Feuille) return pfcResultat.PERDU;
            break;
        case pfcChoix.Feuille:
            if (choixBot.nom === pfcChoix.Pierre) return pfcResultat.GAGNÉ;
            if (choixBot.nom === pfcChoix.Ciseaux) return pfcResultat.PERDU;
            break;
        case pfcChoix.Ciseaux:
            if (choixBot.nom === pfcChoix.Feuille) return pfcResultat.GAGNÉ;
            if (choixBot.nom === pfcChoix.Pierre) return pfcResultat.PERDU;
            break;
    }
}

export function pfcPlayBot(): pfcProposition {
    return pfcProposition.propositions[randomInt(pfcProposition.propositions.length)];
}

export function pfcTraitementResultat(choix: pfcProposition, choixBot: pfcProposition, resultat: pfcResultat, user: User) {
    switch (resultat) {
        case pfcResultat.GAGNÉ:
            return { content: `(${user}) ${choixBot} ! Well, noob ${choix} need nerf plz...` };
        case pfcResultat.PERDU:
            return { content: `(${user}) ${choixBot} ! GG NO RE, EZ !` };
        case pfcResultat.ÉGALITÉ:
            return { content: `(${user}) ${choixBot} ! Ha... Égalité...` };
    }
}