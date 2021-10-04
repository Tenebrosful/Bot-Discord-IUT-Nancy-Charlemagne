import { ArgsOf, Client, Discord, On } from "discordx";

@Discord()
abstract class DiversMessage {

    @On("messageCreate")
    helloDidier(
        [message]: ArgsOf<"messageCreate">,
        client: Client
    ) {
        if(message.content.toLowerCase().includes("hey didier")){
            message.reply({content: `Hey ${message.author} !`})
        }
    }
}