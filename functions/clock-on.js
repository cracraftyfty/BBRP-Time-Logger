const { MessageEmbed } = require("discord.js");
const ee = require(`../botconfig/embed.json`);
const cap = require('../functions/cap.js');
const fs = require("fs")
const moment = require('moment-timezone')
module.exports = async function (status, member, client, interaction) {
    //return console.log(status, member, client, interaction)
    if(status === 'off') return
    const liveFeed = require(`../functions/live-feed.js`)
    let dept = 'Rising Sun Autos'

    const settings = require('../database/settings.json');
    /* return interaction.reply({
        embeds: [
            new MessageEmbed()
            .setColor('RED')
            .setDescription(`${settings.emotes.wrong} Option disabled`)
        ], 
        ephemeral:true
    }) */

    //Read Files 
    //const settings = require('../database/settings.json');
    let emote = settings.emotes
    let userTemplate = JSON.parse(fs.readFileSync(`./database/userTemplate.json`))

    //Check if file exists, if not create one
    if(!fs.existsSync(`./database/users/${member.id}.json`)){
        userTemplate.details.discordID = member.id
        userTemplate.details.discordTag = member.user.tag
        userTemplate.user_is_staff = true
        fs.writeFileSync(`./database/users/${member.id}.json`, JSON.stringify(userTemplate, null, 4))
    }

    let userfile = JSON.parse(fs.readFileSync(`./database/users/${member.id}.json`)) //Read Userfile

    //Check if city name and number is registered
    if(!userfile.details.cityNumber || !userfile.details.cityName){
        if(interaction === null) return
        return interaction.reply({
            embeds: [
                new MessageEmbed()
                .setColor('RED')
                .setDescription(`${settings.emotes.wrong} Failed to find user file in database.\nPlease register your details.`)
            ],
            ephemeral: true
        })
    }

    //Get timezoned time
    var today =  moment.tz('Australia/Sydney');

    let clocker = today.format('HH:mm:ss a')
    let clock_date = `${today.format('DD-MM-YYYY')}** at **${today.format('HH:mm:ss')} AEDT`
    let log_channel2 = client.channels.cache.get(settings.channels.log_dump)

    if(userfile.clocked_status.status === true){
        if(interaction === null) return
        return interaction.reply({
            embeds:[
                new MessageEmbed()
                .setDescription(`${emote.wrong} You are already clocked on.`)
                .setColor(ee.wrongcolor)
            ],
            ephemeral: true 
        })
    }

    //assign role
    /* let ONDUTY_ROLE = await client.guilds.cache.get(settings.guild_ID).roles.cache.get(settings.job_roles.onDuty)
    member.roles.add(ONDUTY_ROLE) */

    //Send clock on confirmation message
    let clockEmbed = new MessageEmbed()
    .setColor('GREEN')
    .setDescription(`${emote.check} **${cap(userfile.details.cityName)}** clocked on for **${cap(dept)}**`)
    if(!member.roles.cache.some(role => role.id === settings.department_role[dept])) clockEmbed.setDescription(`${emote.check} **${cap(userfile.details.cityName)}** clocked on for **${cap(dept)}**\n\n[!!!] CAUTION [!!!] ${member}, does not have a role for **${cap(dept)}**`)
    
    if(interaction != null) interaction.reply({
        embeds: [clockEmbed],
        ephemeral: true
    })

    //Log the clock on
    log_channel2.send({
        embeds: [
            new MessageEmbed()
            .setDescription(`${emote.check} **[CLOCK ON]** **${userfile.details.cityName}** clocked on for **${cap(dept)}**`)
            .setColor('GREEN')
            .setFooter(`ID: ${member.user.id}, Tag: ${member.user.tag}`)
        ]
    })

    //LOG CLOCK ON
    let log_channel = client.channels.cache.get(settings.channels.clocking_logs[dept])
    await log_channel.send({
        embeds: [
            new MessageEmbed()
            .setColor('#ad6dfd')
            .setDescription(`${emote.check} ${member} clocked on for **${cap(dept)}** on **${clock_date}** (ID: ${member.id})`)
        ]
    }).then(msg => {
        userfile.clocked_status.clocked_on_log_messageID = msg.id
        fs.writeFileSync(`./database/users/${member.id}.json`, JSON.stringify(userfile, null, 4))
    })

    //clocking 
    userfile.clocked_status.status = true
    userfile.clocked_status.dept = dept
    userfile.clocked_status.clocked_on = clocker
    userfile.clocked_status.clocked_on_preview = `${today.format('DD-MM-YYYY HH:mm:ss')} AEDT`

    fs.writeFileSync(`./database/users/${member.id}.json`, JSON.stringify(userfile, null, 4))

    //Update live feed
    liveFeed(client)
    
}