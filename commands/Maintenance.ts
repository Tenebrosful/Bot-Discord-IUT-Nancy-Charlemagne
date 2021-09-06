import { DefaultPermission, Discord, Guild, Permission, SlashGroup } from "discordx";
import { RoleIDs, ServerIDs } from "../enums/IDs";

@Discord()
@Guild(ServerIDs.MAIN)
@DefaultPermission(false)
@Permission({ id: RoleIDs.ADMIN, type: 'ROLE', permission: true })
@Permission({ id: RoleIDs.STAR, type: 'ROLE', permission: true })
@SlashGroup("maintenance", "Commandes de maintenance du serveur")
abstract class Maintenance {

}