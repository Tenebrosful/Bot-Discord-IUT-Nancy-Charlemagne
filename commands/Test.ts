import { Discord, Slash, Guild, Permission, Description } from "@typeit/discord";
import { CommandInteraction, MessageButton, MessageActionRow } from "discord.js";
import { ServerIDs, RoleIDs } from "../enums/IDs";

@Discord()
@Guild(ServerIDs.MAIN)
@Permission(RoleIDs.STAR, 'ROLE')
@Permission(RoleIDs.ADMIN, 'ROLE')
@Permission(RoleIDs.BETA_TEST, 'ROLE')
abstract class Test {

    @Slash('testMessageBouton')
    @Description("Affiche un message contenant des boutons Discord TROP COOL")
    private testBouton(interaction: CommandInteraction) {
        interaction.defer();

        const button1 = new MessageButton()
            .setLabel('Vive')
            .setStyle('PRIMARY')
            .setEmoji('👀')
            .setCustomID('testButton1');

        const button2 = new MessageButton()
            .setLabel('les')
            .setStyle('SECONDARY')
            .setEmoji('👀')
            .setCustomID('testButton2');

        const button3 = new MessageButton()
            .setLabel('Boutons')
            .setStyle('SUCCESS')
            .setEmoji('👀')
            .setCustomID('testButton3');

        const button4 = new MessageButton()
            .setLabel('Discord')
            .setStyle('DANGER')
            .setEmoji('👀')
            .setCustomID('testButton4');

        const button5 = new MessageButton()
            .setLabel('WOW')
            .setStyle('LINK')
            .setEmoji('👀')
            .setURL("https://www.youtube.com/watch?v=dQw4w9WgXcQ");

        const buttonRow = new MessageActionRow()
            .addComponents(button1)
            .addComponents(button2)
            .addComponents(button3)
            .addComponents(button4)
            .addComponents(button5);

        interaction.editReply({ content: "Test", components: [buttonRow, buttonRow] })
    }
}