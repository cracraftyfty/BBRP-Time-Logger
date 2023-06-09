const { MessageEmbed } = require("discord.js");
const ee = require(`../botconfig/embed.json`);
const cap = require('../functions/cap.js');
const settings = require('../database/settings.json');
let emote = settings.emotes
const fs = require('fs')
const ms = require('pretty-ms'); 
const moment = require('moment-timezone')
module.exports = async (client, interaction) => {
    if(!interaction.isButton()) return
    const {guild, member, customId} = interaction;
    if(!["timelog"].includes(customId)) return

   /*  if(member.id != '344915148487786498') return interaction.reply({
        embeds: [
            new MessageEmbed()
            .setColor('RED')
            .setDescription(`${settings.emotes.wrong} Option restricted to Skynet Only`)
        ],
        ephemeral: true
    }) */

    //readFile
    let dept = 'recorded-time'
    
    let log_channel

    let userTemplate = JSON.parse(fs.readFileSync(`./database/userTemplate.json`))
    if(!fs.existsSync(`./database/users/${member.id}.json`)){
        userTemplate.details.discordID = member.id
        userTemplate.details.discordTag = member.user.tag
        userTemplate.user_is_staff = true
        fs.writeFileSync(`./database/users/${member.id}.json`, JSON.stringify(userTemplate, null, 4))
    }

    let userfile = JSON.parse(fs.readFileSync(`./database/users/${member.id}.json`))

    if(!userfile.details.cityNumber || !userfile.details.cityName){
        return interaction.reply({
            embeds: [
                new MessageEmbed()
                .setColor('RED')
                .setDescription(`${settings.emotes.wrong} Please setup your **City Name** and **City Phone Number** in the bot using the register button`)
            ], 
            ephemeral: true
        })
    }

    userfile = JSON.parse(fs.readFileSync(`./database/users/${member.id}.json`))

    //Get timezoned time
    var today =  moment.tz('Australia/Sydney');

    let msg_send = ''

    for(let keys in userfile.prior_months){
        msg_send += `- **${keys}**: ${ms(userfile.prior_months[keys]*1000, {verbose: true})}\n`
    }
    interaction.reply({
        embeds: [
            new MessageEmbed()
            .setColor('#ad6dfd')
            .setTitle(`${cap(userfile.details.cityName)} - Time Log`)
            .setThumbnail(guild.iconURL())
            .setFooter({
                text: ee.footertext,
                iconURL: ee.footericon
            })
            .setTimestamp()
            .setDescription(`Past Months hours for **${cap(dept)}**\n${msg_send}`)
        ],
        ephemeral: true
    })
}