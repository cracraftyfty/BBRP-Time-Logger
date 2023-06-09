const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const fs = require('fs');
const moment = require('moment-timezone');
const ee = require("../botconfig/embed.json");
const pms = require('pretty-ms');
const cap = require('../functions/cap.js');
module.exports = {
    name: "profile",
    description: "Fetches the profile of the mentioned user",
    cooldown: 5,
    memberpermissions: [],
    requiredroles: ["940867840376967168"],
    alloweduserids: [],
    options: [
		{"User": { name: "ping_a_user", description: "Mention the user whose profile need to be checked", required: true }},
    ],
    run: async (client, interaction) => {
        const {guild, member} = interaction;
        const settings = JSON.parse(fs.readFileSync('./database/settings.json'));
        let emote = settings.emotes

        let user = guild.members.cache.get(interaction.options.getUser("ping_a_user").id)
        let userFile = JSON.parse(fs.readFileSync(`./database/users/${user.id}.json`))

        var today = moment.tz('Australia/Sydney')


        let profileEmbed = new MessageEmbed()
        .setColor('#00F0E0')
        if(userFile.details.cityName){
            profileEmbed.setTitle(`${cap(userFile.details.cityName)}'s Profile`)
            profileEmbed.addField('City Name', cap(userFile.details.cityName), true)
        }else{
            profileEmbed.setTitle(user.user.tag)
            profileEmbed.addField('City Name', `:x: Not Registered`, true)
        }
        if(userFile.details.cityNumber) profileEmbed.addField('City Number', userFile.details.cityNumber, true)
        else profileEmbed.addField('City Number', `:x: Not Registered`, true)
        
        if(userFile.details.steamName) profileEmbed.addField('City Number', userFile.details.steamName, true)
        else profileEmbed.addField('Steam Name', `:x: Not Registered`, true)

        if(userFile.details.callsign) profileEmbed.addField('City Number', `CORR - ${userFile.details.callsign}`, true)
        else profileEmbed.addField('Call Sign', `:x: Not Registered`, true)

        let depts = ["Rising Sun Autos"]    
        let jobtime = ''
        depts.forEach(job => {
            jobtime += `**${cap(job)}** - ${pms(userFile.time_log[job]*1000)}\n\n`
        })

        jobtime += `**Prior Months**:\n`
        for(let keys in userFile.prior_months){
            jobtime += `**${keys}** - ${pms(userFile.prior_months[keys] *1000)}\n`
        }

        profileEmbed.addField(`Time Recorded (January, 2023)`, jobtime)
        profileEmbed.setTimestamp()
        profileEmbed.setThumbnail(ee.footericon)
        profileEmbed.setFooter(ee.footertext, ee.footericon)

        interaction.reply({
            embeds: [profileEmbed],
            components: [
                new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId(`employee-timewarn-${userFile.details.DiscordID}`)
                        .setLabel(`Time Warn (${userFile.timeWarn}/3)`)
                        .setEmoji(settings.emotes.warn)
                        .setDisabled(true)
                        .setStyle('PRIMARY'),
                    new MessageButton()
                        .setCustomId(`appsub-message-${userFile.details.DiscordID}`)
                        .setLabel('Message Employee')
                        .setEmoji('📣')
                        .setDisabled(true)
                        .setStyle('SECONDARY'),
                    new MessageButton()
                        .setCustomId(`employee-promote-${userFile.details.DiscordID}`)
                        .setLabel('Promote')
                        .setDisabled(true)
                        .setEmoji('<a:promote:1070710165701136415>')
                        .setStyle('SUCCESS'),
                    new MessageButton()
                        .setCustomId(`employee-demote-${userFile.details.DiscordID}`)
                        .setLabel('Demote')
                        .setDisabled(true)
                        .setEmoji('<a:demote:1070710159388708944>')
                        .setStyle('DANGER'),
                    new MessageButton()
                        .setCustomId(`employee-fire-${userFile.details.DiscordID}`)
                        .setLabel('Fire Employee')
                        .setDisabled(true)
                        .setEmoji(settings.emotes.warn)
                        .setStyle('DANGER')
                )
            ],
            ephemeral: true
        })

        }
    }