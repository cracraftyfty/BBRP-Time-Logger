//Import Modules
const config = require(`../botconfig/config.json`);
const { MessageEmbed,InteractionType  } = require("discord.js");
const ee = require(`../botconfig/embed.json`);
const nwc = require('../functions/nwc.js');
const cap = require('../functions/cap.js');
  
const settings = require('../database/settings.json');
const { onCoolDown, replacemsg } = require("../handlers/functions");
const botsettings = require(`../botconfig/settings.json`);
const Discord = require('discord.js')
const fs = require('fs')
const ms = require('ms')
const moment = require('moment-timezone')
const { Modal, TextInputComponent, showModal } = require("discord-modals");
const discordModals = require('discord-modals'); // Define the discord-modals package!
const { Formatters } = require('discord.js');
module.exports = async (client, interaction) => {
    const {guild, member, customId} = interaction;
    let today = moment.tz('Australia/Sydney');
    if (interaction.type !== 'MODAL_SUBMIT') return;
    if([`register+${member.id}`].includes(customId)){
        let firstResponse = interaction.fields.getTextInputValue('cityname');
        let secondResponse = interaction.fields.getTextInputValue('citynumber');
        let fourthResponse = interaction.fields.getTextInputValue('steamname')

        let passthru = true
        let stafffFile
        let staff_dir = fs.readdirSync(`./database/users/`)

        staff_dir.forEach(file => {
            stafffFile = JSON.parse(fs.readFileSync(`./database/users/${file}`))
        })

        

        let userTemplate = JSON.parse(fs.readFileSync('./database/userTemplate.json'))
        if(!fs.existsSync(`./database/users/${member.id}.json`)){
            userTemplate.details.discordID = member.id
            userTemplate.details.discordTag = member.user.tag
            fs.writeFileSync(`./database/users/${member.id}.json`, JSON.stringify(userTemplate, null, 4))
        }
        let userfile = JSON.parse(fs.readFileSync(`./database/users/${member.id}.json`))

        interaction.reply({
            embeds: [
                new MessageEmbed()
                .setTitle("Time Logger | Employee Registration")
                .setDescription(`${settings.emotes.check} Information Added successfully.`)
                .addField('Name', cap(firstResponse), true)
                .addField('Number', secondResponse, true)
                .addField('Steam Name', fourthResponse, true)
                .setTimestamp()
                .setFooter({
                    text: ee.footertext,
                    iconURL: ee.footericon
                })
                .setColor('GREEN')
            ], ephemeral: true
        });
        userfile.details.cityName = firstResponse
        userfile.details.cityNumber = secondResponse
        userfile.details.steamName = fourthResponse

        fs.writeFileSync(`./database/users/${member.id}.json`, JSON.stringify(userfile, null, 4))
        userfile = JSON.parse(fs.readFileSync(`./database/users/${member.id}.json`))
        client.channels.cache.get(settings.channels.log_dump).send({
            embeds: [
                new MessageEmbed()
                .setTitle("Time Logger | Employee Registration")
                .setDescription(`${settings.emotes.check} Registered ${interaction.member} [${member.user.tag} | ${member.id}]`)
                .addField('Name', cap(firstResponse), true)
                .addField('Number', secondResponse, true)
                .addField('Steam Name', fourthResponse, true)
                .setTimestamp()
                .setFooter({
                    text: ee.footertext,
                    iconURL: ee.footericon
                })
                .setColor('BLACK')
            ]
        })
    }
}