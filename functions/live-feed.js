const { MessageEmbed } = require("discord.js");
const ee = require(`../botconfig/embed.json`);
const nwc = require('../functions/nwc.js');
const cap = require('../functions/cap.js');
const fs = require("fs");
module.exports = async function (client) {
    const settings = require('../database/settings.json');
    let feed = {
        "Rising Sun Autos": ""
    }

    let onDutyCount = {
        "Rising Sun Autos": 0
    }

    let staff_dir = fs.readdirSync(`./database/users/`)

    staff_dir.forEach(members => {
        let memberFile = JSON.parse(fs.readFileSync(`./database/users/${members}`))
        if(memberFile.clocked_status.status == true){
            onDutyCount[memberFile.clocked_status.dept] ++
            if(memberFile.details.cityName)  feed[memberFile.clocked_status.dept] += `- ${cap(memberFile.details.cityName)} **|** Ph: ${memberFile.details.cityNumber} \n`
            else  feed[memberFile.clocked_status.dept] += `- **${cap(memberFile.details.discordTag)}**\n`
            
        }
    })
    for(let keys in feed){
        let feed_channel = client.channels.cache.get(settings.channels.live_feed[keys])
        let feed_msg = `**${nwc(onDutyCount[keys])} ${cap(keys)}** on duty.\n\n${feed[keys]}`
        let embed = new MessageEmbed()
        .setColor('RANDOM')
        .setTitle(`${cap(keys)} Live Feed`)
        .setDescription(feed_msg)
        .setTimestamp()
        .setFooter(ee.footertext, ee.footericon)
        .setThumbnail(ee.footericon)

        feed_channel.messages.fetch(settings.message_live_ids).then(message => {
            message.edit({embeds: [embed]});
        }).catch(err => {
            console.error(err);
        });
    }
}