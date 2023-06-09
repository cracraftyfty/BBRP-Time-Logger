//Import Modules
const { MessageEmbed } = require("discord.js");
const settings = require('../database/settings.json');
let emote = settings.emotes;
const fs = require('fs');
const moment = require('moment-timezone');
module.exports = async (client, interaction) => {
    if(!interaction.isButton()) return
    const {guild, member, customId} = interaction;
    
    let userfile
    if(!fs.existsSync(`./database/users/${member.id}.json`)) return interaction.reply({
        embeds: [
            new MessageEmbed()
            .setColor('RED')
            .setDescription(`${emote.wrong} You are not registered, please register`)
        ],
        ephemeral: true
    })
    userfile = JSON.parse(fs.readFileSync(`./database/users/${member.id}.json`))

    let today = moment.tz('Australia/Sydney');

    let leaverole = await guild.roles.cache.get(settings.job_roles.leave)
    if(customId === 'onleave'){
        if(member.roles.cache.some(role => role === leaverole)) return interaction.reply({
            embeds: [
                new MessageEmbed()
                .setColor('RED')
                .setDescription(`${emote.wrong} You are already **ON LEAVE**`)
            ],
            ephemeral: true
        })

        member.roles.add(leaverole)
        
        interaction.reply({
            embeds: [
                new MessageEmbed()
                .setColor('GREEN')
                .setDescription(`${emote.check} Successfully marked **On Leave**`)
            ],
            ephemeral: true
        })

        client.channels.cache.get(settings.channels.leave_logs).send({
            embeds: [
                new MessageEmbed()
                .setColor('GREEN')
                .setDescription(`${settings.emotes.loading} ${member} marked on leave`)
                .addField('Applied On', `${today.format('DD-MM-YY | HH:mm:ss a')} AEDT`, true)
                .addField('Off Leave On', `Ongoing...`, true)
            ]
        }).then(m => {
            if(userfile.hasOwnProperty('leaveLog')){
                userfile.leaveLog.appliedOn = `${today.format('DD-MM-YY | HH:mm:ss a')} AEDT`,
                userfile.leaveLog.msgId = m.id
                userfile.leaveLog.logs.push({
                    "onleave": `${today.format('DD-MM-YY | HH:mm:ss a')} AEDT`,
                    "offleave": 'Ongoing...'
                })
                fs.writeFileSync(`./database/users/${member.id}.json`, JSON.stringify(userfile, null, 4))
            }else{
                userfile.leaveLog = {
                    "appliedOn": `${today.format('DD-MM-YY | HH:mm:ss a')} AEDT`,
                    "msgId": m.id,
                    "logs": [
                        {
                            "onleave": `${today.format('DD-MM-YY | HH:mm:ss a')} AEDT`,
                            "offleave": 'Ongoing...'
                        }
                    ]
                }
                fs.writeFileSync(`./database/users/${member.id}.json`, JSON.stringify(userfile, null, 4))
            }
        })
    }

    if(customId === 'offleave'){
        if(!member.roles.cache.some(role => role === leaverole)) return interaction.reply({
            embeds: [
                new MessageEmbed()
                .setColor('RED')
                .setDescription(`${emote.wrong} You are already **OFF LEAVE**`)
            ],
            ephemeral: true
        })
        member.roles.remove(leaverole)

        interaction.reply({
            embeds: [
                new MessageEmbed()
                .setColor('GREEN')
                .setDescription(`${emote.check} Successfully marked **Off Leave**`)
            ],
            ephemeral: true
        })

        await client.channels.cache.get(settings.channels.leave_logs).messages.fetch(userfile.leaveLog.msgId).then(m => {
            m.edit({
                embeds: [
                new MessageEmbed()
                .setColor('GREEN')
                .setDescription(`${settings.emotes.check} ${member} marked on leave`)
                .addField('Applied On', userfile.leaveLog.appliedOn, true)
                .addField('Off Leave On', `${today.format('DD-MM-YY | HH:mm:ss a')} AEDT`, true)
            ]
            }).then(() => {
                userfile.leaveLog.appliedOn = ''
                userfile.leaveLog.msgId = ''
                userfile.leaveLog.logs[userfile.leaveLog.logs.length-1].offleave = `${today.format('DD-MM-YY | HH:mm:ss a')} AEDT`
                fs.writeFileSync(`./database/users/${member.id}.json`, JSON.stringify(userfile, null, 4))
            })
        })  
    }
}
