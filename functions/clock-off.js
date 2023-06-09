const { MessageEmbed } = require("discord.js");
const ee = require(`../botconfig/embed.json`);
const cap = require('../functions/cap.js');
const fs = require("fs")
const moment = require('moment-timezone')
module.exports = async function (status, member, client, interaction) {
    //console.log(status, member, client, interaction)
    if(status === 'on') return
    const liveFeed = require(`../functions/live-feed.js`)
    let dept = 'Rising Sun Autos'
    
    //Read Files 
    const settings = require('../database/settings.json');
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
                .setDescription(`${settings.emotes.wrong} Failed to find user file in database.\nPlease head to <#1098613573330141314> to register your details.`)
            ],
            ephemeral: true
        })
    }

    //Get timezoned time
    var today =  moment.tz('Australia/Sydney');

    let clocker = today.format('HH:mm:ss a')
    let clock_date = `${today.format('DD-MM-YYYY')}** at **${today.format('HH:mm:ss')} AEDT`
    let log_channel2 = client.channels.cache.get(settings.channels.log_dump)

    //Check if user is already clocked off
    if(userfile.clocked_status.status === false){
        if(interaction === null) return
        return interaction.reply({
            embeds:[
                new MessageEmbed()
                .setDescription(`${emote.wrong} You are already clocked off`)
                .setColor(ee.wrongcolor)
            ],
            ephemeral: true 
        })
    }

    //Post in log dump
    log_channel2.send({
        embeds: [
            new MessageEmbed()
            .setDescription(`${emote.check} **[CLOCK OFF]** **${userfile.details.cityName}** clocked off for **${cap(dept)}**`)
            .setColor('RED')
            .setFooter(`ID: ${member.user.id}, Tag: ${member.user.tag}`)
        ]
    })
    if(interaction != null) interaction.reply({
        embeds:[
            new MessageEmbed()
            .setColor('RED')
            .setDescription(`${emote.check} **${userfile.details.cityName}** clocked off`)
        ], ephemeral: true
    })
    

    /* let ONDUTY_ROLE = await client.guilds.cache.get(settings.guild_ID).roles.cache.get(settings.job_roles.onDuty)
    member.roles.remove(ONDUTY_ROLE) */

    var hrs = parseInt(moment.utc(moment(clocker, "HH:mm:ss").diff(moment(userfile.clocked_status.clocked_on, "HH:mm:ss"))).format("HH"))
        var mins = parseInt(moment.utc(moment(clocker, "HH:mm:ss").diff(moment(userfile.clocked_status.clocked_on, "HH:mm:ss"))).format("mm"))
        var secs = parseInt(moment.utc(moment(clocker, "HH:mm:ss").diff(moment(userfile.clocked_status.clocked_on, "HH:mm:ss"))).format("ss"))

        let time_clocked = ''
        if(hrs > 0) time_clocked += `${hrs} Hours `
        if(mins > 0) time_clocked += `${mins} Minutes `
        if(secs > 0) time_clocked += `${secs} Seconds `
        
        let seconds = hrs*3600 + mins*60 + secs
        
        let log_channel = client.channels.cache.get(settings.channels.clocking_logs[dept])

        let time_worked_embed = new MessageEmbed()
        .setColor('RED')
        .setDescription(`${emote.check} **${cap(userfile.details.cityName)}** worked **${time_clocked}** for **${cap(dept)}**`)
        .addField('Clocked On', `${userfile.clocked_status.clocked_on_preview}`, true)
        .addField('Clocked Off', `${today.format('DD-MM-YYYY HH:mm:ss')} AEDT`, true)
        await log_channel.messages.fetch(userfile.clocked_status.clocked_on_log_messageID).then(message => {
            message.edit({embeds: [time_worked_embed]});
        }).catch(err => {
            console.error(err);
        })

        userfile.clocked_status.status = false
        userfile.clocked_status.dept = ''
        userfile.clocked_status.clocked_on = ''
        userfile.clocked_status.clocked_on_preview = ''
        userfile.clocked_status.clocked_on_log_messageID = ''


        userfile.time_log[dept] += seconds

        fs.writeFileSync(`./database/users/${member.id}.json`, JSON.stringify(userfile, null, 4))

        //Update live feed
        liveFeed(client)

}