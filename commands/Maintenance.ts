import { Discord, Slash, Description, Permission, Guild, Option } from "@typeit/discord";
import { AwaitMessagesOptions, Collection, CommandInteraction, Message, MessageCollector, Snowflake, TextChannel } from "discord.js";
import { SingletonClient } from "..";
import { Role, Server } from "../enums/IDs";

@Discord()
@Guild(Server.MAIN)
@Permission(Role.ADMIN, 'ROLE')
@Permission(Role.STAR, 'ROLE')
abstract class Maintenance {
    @Slash('purgeChannel')
    @Description("Clone et supprime le salon afin de supprimer son contenu")
    private purgeChannel(interaction: CommandInteraction) {
        const channel = <TextChannel>interaction.channel;

        channel.clone({ reason: `Purge du salon demandé par ${interaction.user.username}` });
        channel.delete(`Purge du salon demandé par ${interaction.user.username}`);
    }
}