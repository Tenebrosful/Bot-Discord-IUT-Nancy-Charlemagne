import { ApplicationCommandPermissionData } from "discord.js";
import { Serveur } from "../IDs";
import { Role as Role_IUT_NC_DEPINFO } from "../iut_nc_depinfo/IDs";

export const globalAdminPerms: ApplicationCommandPermissionData[] = [
    { id: Role_IUT_NC_DEPINFO.STAR, type: "ROLE", permission: true },
    { id: Role_IUT_NC_DEPINFO.ADMIN, type: "ROLE", permission: true },
    //{ id: RoleBeta.BETA_1, type: "ROLE", permission: true },
    //{ id: RoleBeta.BETA_2, type: "ROLE", permission: true }
]

export const globalEnseignantPerms: ApplicationCommandPermissionData[] = [
    { id: Role_IUT_NC_DEPINFO.ENSEIGNANT, type: "ROLE", permission: true }
]

export const allServeursIds: Serveur[] = [
    Serveur.IUT_NC_DEP_INFO,
    //Serveur.BETA_2,
    //Serveur.BETA_1
]
]