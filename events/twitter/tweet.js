const Discord = require('discord.js');
const fs = require('fs');

module.exports = {
    name: 'tweet',
    endPoint: 'statuses/filter',
    options: {
        follow: ['329665290', '282478715', '4113039761', '1257587508738699265']
    },
    channel_id: '854010477838073876',
    /**
     * 
     * @param {*} tweet 
     * @param {Discord.Client} client 
     */
    async execute(tweet, client) {
        if (!this.options.follow.includes(tweet.user.id_str)) return;
        if (tweet.in_reply_to_status_id || tweet.in_reply_to_status_id_str || tweet.in_reply_to_user_id || tweet.in_reply_to_user_id_str || tweet.in_reply_to_screen_name) return;

        fs.writeFileSync('./testData.json', JSON.stringify(tweet));
        console.log(`@${tweet.user.screen_name} : ${tweet.text}`);

        /**
         * @type {Discord.TextChannel}
         */
        const channel = client.channels.resolve(this.channel_id);
        channel.startTyping();

        const resEmbed = new Discord.MessageEmbed()
            .setColor('#1DA1F2')
            .setAuthor(tweet.user.name, tweet.user.profile_image_url, `https://twitter.com/${tweet.user.screen_name}`)
            .setThumbnail(tweet.user.profile_image_url)
            .setDescription(tweet.extended_tweet?.full_text || tweet.text)
            .setTimestamp(tweet.created_at);

        if (tweet.retweeted_status) {
            resEmbed.setTitle(`${tweet.user.screen_name} a retweeté(e)`)
                .setAuthor(tweet.retweeted_status.user.name, tweet.retweeted_status.user.profile_image_url, `https://twitter.com/${tweet.retweeted_status.user.screen_name}`)
                .setThumbnail(tweet.retweeted_status.user.profile_image_url)
                .setDescription(tweet.retweeted_status.extended_tweet?.full_text || tweet.retweeted_status.text);
        } else {
            resEmbed.setTitle(`Nouveau Tweet !`)
        }

        if (tweet.quoted_status) {
            resEmbed.addField(`A cité un Tweet de ${tweet.quoted_status.user.name}`, tweet.quoted_status.extended_tweet?.full_text || tweet.quoted_status.text);
            if (tweet.quoted_status?.extended_tweet?.extended_entities?.media) {
                resEmbed.setImage(tweet.quoted_status?.extended_tweet?.extended_entities?.media?.[0]?.media_url);
            }
        }

        if (tweet.extended_entities?.media || tweet?.extended_tweet?.extended_entities?.media || tweet.retweeted_status?.extended_tweet?.extended_entities?.media) {
            resEmbed.setImage(tweet.extended_entities?.media?.[0]?.media_url || tweet.extended_tweet?.extended_entities?.media?.[0]?.media_url || tweet.retweeted_status?.extended_tweet?.extended_entities?.media?.[0]?.media_url);
        }

        await channel.send({embeds: [resEmbed]});
        channel.stopTyping();
    }
}