import { Discord, Slash, Group, Description, Permission } from "@typeit/discord";
import { CommandInteraction, TextChannel } from "discord.js";
import { Role } from "../enums/IDs";

@Discord()
abstract class Maintenance {
    @Slash('purgeChannel')
    @Description("Clone et supprime le salon afin de supprimer son contenu")
    @Permission(Role.ADMIN, 'ROLE')
    private purgeChannel(interaction: CommandInteraction) {
        const channel = <TextChannel>interaction.channel;

        channel.clone({ reason: `Purge du salon demandé par ${interaction.user.username}` });
        channel.delete(`Purge du salon demandé par ${interaction.user.username}`);
    }
}