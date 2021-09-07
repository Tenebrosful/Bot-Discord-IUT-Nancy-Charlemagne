import { Client, MessageEmbed } from 'discord.js';
import * as Twit from 'twit';
import { ChannelIDs, ServerIDs } from '../../enums/IDs';

module.exports = {
    name: 'tweet',
    endPoint: 'statuses/filter',
    options: {
        follow: ['329665290', '282478715', '4113039761', '1257587508738699265']
    },
    async execute(tweet: Twit.Twitter.Status, client: Client) {
        if (!this.options.follow.includes(tweet.user.id_str)) return;
        if (tweet.in_reply_to_status_id || tweet.in_reply_to_status_id_str || tweet.in_reply_to_user_id || tweet.in_reply_to_user_id_str || tweet.in_reply_to_screen_name) return;

        console.log(`@${tweet.user.screen_name} : ${tweet.text}`);

        const channel = client.guilds.resolve(ServerIDs.MAIN)?.channels.resolve(ChannelIDs.TWITTER);

        if (!channel || !channel.isText()) { console.log(`[Channel Error] Channel type = ${channel?.type}`); return; }

        channel.sendTyping();

        const resEmbed = new MessageEmbed()
            .setColor('#1DA1F2')
            .setAuthor(tweet.user.name, tweet.user.profile_image_url, `https://twitter.com/${tweet.user.screen_name}`)
            .setThumbnail(tweet.user.profile_image_url)
            //@ts-ignore
            .setDescription(tweet.extended_tweet?.full_text || tweet.text)
            //@ts-ignore
            .setTimestamp(tweet.created_at);

        if (tweet.retweeted_status) {
            resEmbed.setTitle(`${tweet.user.screen_name} a retweeté(e)`)
                .setAuthor(tweet.retweeted_status.user.name, tweet.retweeted_status.user.profile_image_url, `https://twitter.com/${tweet.retweeted_status.user.screen_name}`)
                .setThumbnail(tweet.retweeted_status.user.profile_image_url)
                //@ts-ignore
                .setDescription(tweet.retweeted_status.extended_tweet?.full_text || tweet.retweeted_status.text);
        } else {
            resEmbed.setTitle(`Nouveau Tweet !`)
        }

        if (tweet.quoted_status) {
            //@ts-ignore
            resEmbed.addField(`A cité un Tweet de ${tweet.quoted_status.user.name}`, tweet.quoted_status.extended_tweet?.full_text || tweet.quoted_status.text);
            //@ts-ignore
            if (tweet.quoted_status?.extended_tweet?.extended_entities?.media) {
                //@ts-ignore
                resEmbed.setImage(tweet.quoted_status?.extended_tweet?.extended_entities?.media?.[0]?.media_url);
            }
        }

        //@ts-ignore
        if (tweet.extended_entities?.media || tweet?.extended_tweet?.extended_entities?.media || tweet.retweeted_status?.extended_tweet?.extended_entities?.media) {
            //@ts-ignore
            resEmbed.setImage(tweet.extended_entities?.media?.[0]?.media_url || tweet.extended_tweet?.extended_entities?.media?.[0]?.media_url || tweet.retweeted_status?.extended_tweet?.extended_entities?.media?.[0]?.media_url);
        }

        await channel.send({ embeds: [resEmbed] });
    }
}