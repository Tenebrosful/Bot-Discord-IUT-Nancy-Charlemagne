import { Client, MessageActionRow, MessageButton, MessageEmbed, MessageOptions } from 'discord.js';
import * as Twit from 'twit';
import { getHorodateConsole } from '../../../../libs/util';
import { followTwitter, salonIdPostTwitter } from '../../GlobalVar';

module.exports = {
    name: 'tweet',
    endPoint: 'statuses/filter',
    options: {
        follow: followTwitter
    },
    async execute(tweet: Twit.Twitter.Status, client: Client) {
        if (!this.options.follow.includes(tweet.user.id_str)) return;
        if (tweet.in_reply_to_status_id || tweet.in_reply_to_status_id_str || tweet.in_reply_to_user_id || tweet.in_reply_to_user_id_str || tweet.in_reply_to_screen_name) return;

        console.log(`${getHorodateConsole()}\t[TWEET]\t@${tweet.user.screen_name} : ${tweet.text}`);

        const post = genererPost(tweet);

        const salons = salonIdPostTwitter.map(id => client.channels.resolve(id));

        salons.forEach(async (salon, i) => {
            if (!salon || !salon.isText()) { console.log(`${getHorodateConsole()}\t[Channel Error]\t${salonIdPostTwitter[i]} Channel type = ${salon?.type}`); return; }

            salon.sendTyping();

            const message = await salon.send(post);

            if (salon.type === "GUILD_NEWS" || salon.type === "GUILD_NEWS_THREAD")
                await message.crosspost();
        })
    }
}

function genererPost(tweet: Twit.Twitter.Status): MessageOptions {
    const resEmbed = new MessageEmbed()
        .setColor('#1DA1F2')
        .setAuthor(tweet.user.name, tweet.user.profile_image_url, `https://twitter.com/${tweet.user.screen_name}`)
        .setThumbnail(tweet.user.profile_image_url)
        //@ts-ignore
        .setDescription(tweet.extended_tweet?.full_text || tweet.text)
        //@ts-ignore
        .setTimestamp(tweet.created_at);

    const row = new MessageActionRow();

    if (tweet.retweeted_status) {
        resEmbed.setTitle(`${tweet.user.screen_name} a retweeté(e)`)
            .setAuthor(tweet.retweeted_status.user.name, tweet.retweeted_status.user.profile_image_url, `https://twitter.com/${tweet.retweeted_status.user.screen_name}`)
            .setThumbnail(tweet.retweeted_status.user.profile_image_url)
            //@ts-ignore
            .setDescription(tweet.retweeted_status.extended_tweet?.full_text || tweet.retweeted_status.text);

        row.addComponents(
            new MessageButton()
                .setStyle("LINK")
                .setLabel("Voir le Tweet")
                .setURL(`https://twitter.com/${tweet.retweeted_status.user.screen_name}/status/${tweet.retweeted_status.id_str}`),
            new MessageButton()
                .setStyle("LINK")
                .setLabel("Voir le Profil")
                .setURL(`https://twitter.com/${tweet.retweeted_status.user.screen_name}`)
        );
    } else {
        resEmbed.setTitle(`Nouveau Tweet !`)

        row.addComponents(
            new MessageButton()
                .setStyle("LINK")
                .setLabel("Voir le Tweet")
                .setURL(`https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`),
            new MessageButton()
                .setStyle("LINK")
                .setLabel("Voir le Profil")
                .setURL(`https://twitter.com/${tweet.user.screen_name}`)
        );
    }

    if (tweet.quoted_status) {
        //@ts-ignore
        resEmbed.addField(`A cité un Tweet de ${tweet.quoted_status.user.name}`, tweet.quoted_status.extended_tweet?.full_text || tweet.quoted_status.text);
        //@ts-ignore
        if (tweet.quoted_status?.extended_tweet?.extended_entities?.media) {
            //@ts-ignore
            resEmbed.setImage(tweet.quoted_status?.extended_tweet?.extended_entities?.media?.[0]?.media_url);
        }

        row.addComponents(
            new MessageButton()
                .setStyle("LINK")
                .setLabel("Voir le Tweet Cité")
                .setURL(`https://twitter.com/${tweet.quoted_status.user.screen_name}/status/${tweet.quoted_status.id_str}`),
            new MessageButton()
                .setStyle("LINK")
                .setLabel("Voir le Profil Cité")
                .setURL(`https://twitter.com/${tweet.quoted_status.user.screen_name}`)
        );
    }

    //@ts-ignore
    if (tweet.extended_entities?.media || tweet?.extended_tweet?.extended_entities?.media || tweet.retweeted_status?.extended_tweet?.extended_entities?.media) {
        //@ts-ignore
        resEmbed.setImage(tweet.extended_entities?.media?.[0]?.media_url || tweet.extended_tweet?.extended_entities?.media?.[0]?.media_url || tweet.retweeted_status?.extended_tweet?.extended_entities?.media?.[0]?.media_url);
    }

    return { embeds: [resEmbed], components: [row] };
}