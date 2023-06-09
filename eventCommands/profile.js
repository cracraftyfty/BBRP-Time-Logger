//Import Modules
const { MessageEmbed } = require("discord.js");
const ee = require(`../botconfig/embed.json`);
const cap = require('../functions/cap.js');
const settings = require('../database/settings.json');
let emote = settings.emotes;
const fs = require('fs');
const ms = require('pretty-ms');
const moment = require('moment-timezone');
module.exports = async (client, interaction) => {
    if(!interaction.isButton()) return
    const {guild, member, customId} = interaction;
    if(!["profile"].includes(customId)) return;

    /* if(!member.roles.cache.some(role => role.id === '966106568296910908')) return interaction.reply({
        embeds: [
            new MessageEmbed()
            .setDescription(':x: Option Restricted')
        ], ephemeral: true
    }) */ 

    //READ FILES AND STUFF
    let staff_dir = fs.readdirSync(`./database/users`)
    let userTemplate = JSON.parse(fs.readFileSync(`./database/userTemplate.json`))

    //Create file if userfile is missing
    if(!fs.existsSync(`./database/users/${member.id}.json`)){
        userTemplate.details.discordID = member.id
        userTemplate.details.discordTag = member.user.tag
        userTemplate.user_is_staff = true
        fs.writeFileSync(`./database/users/${member.id}.json`, JSON.stringify(userTemplate, null, 4))
    }
    let userfile = JSON.parse(fs.readFileSync(`./database/users/${member.id}.json`))
    let log_channel = client.channels.cache.get(settings.channels.log_dump)
    
    log_channel.send({
        embeds: [
            new MessageEmbed()
            .setDescription(`${emote.check} **[PROFILE]** **${userfile.details.cityName}** used profile`)
            .setColor('YELLOW')
            .setFooter(`ID: ${member.user.id}, Tag: ${member.user.tag}`)
        ]
    })

    var today = moment.tz('Australia/Sydney')
    let jobs = 'recorded-time'
    let depts = ["recorded-time"]
    let user = interaction.member
        
        
    let jobtime = ''
    depts.forEach(job => jobtime += `**${cap(job)}** - ${ms(userfile.time_log[job]*1000)}\n`)

    if(depts.length <= 0) return interaction.reply({
        embeds: [
            new MessageEmbed()
            .setDescription(`${settings.emotes.wrong} ${interaction.member}, You do not have the job roles`)
            .setColor(ee.wrongcolor)
        ],
        ephemeral: true
    })

        
    interaction.reply({
        embeds: [
            new MessageEmbed()
            .setTitle(`${cap(userfile.details.cityName)}'s Profile`)
            .setTimestamp()
            .setColor('#ad6dfd')
            .setThumbnail(guild.iconURL())
            .addField('City Name', `${userfile.details.cityName}`, true)
            .addField('City Number', `${userfile.details.cityNumber}`, true)
            .addField('Steam Name', `${userfile.details.steamName}`, true)
            .addField(`Time Recorded (${today.format('MMMM')}, ${today.format('YYYY')})`, jobtime)
            .setFooter(ee.footertext, ee.footericon)
        ],
        ephemeral: true
    })  
}