import { ApplicationCommandPermissionData, ChannelResolvable } from "discord.js";
import { RoleBeta, Serveur } from "../../IDs";
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

export const salonIdPostTwitter: ChannelResolvable[] = [
    "854010477838073876", // iut_nc_depinfo twitter
    //"887879239985168384", // Bêta 1 général
    //"885296615529787433", // Bêta 1 e
    //"888005290958675992", // Bêta 2 e
]

export const followTwitter = [
    '329665290', //@Univ_Lorraine
    '282478715', //@iutCharlemagne
    '4113039761', //@regiongrandest
    '1257587508738699265', //@RA_GrandEst
    //'1003899371354755072' //@Tenebrosful (tests)
]