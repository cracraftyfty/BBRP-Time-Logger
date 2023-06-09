const { MessageEmbed } = require("discord.js");
const fs = require('fs');
const ee = require("../../botconfig/embed.json");
const ms = require('ms')
const settings = JSON.parse(fs.readFileSync('./database/settings.json'));
let emote = settings.emotes
module.exports = {
    name: "add",
    description: "Adds given time from a mentioned employee",
    cooldown: 5,
    memberpermissions: [],
    requiredroles: [
        "1098422126186352730",
        "1098422092027920494",
        "1098542738431037500",
        "1098435144865558528" //Star Role
    ], 
    alloweduserids: [],
    options: [
    		{"String": { name: "time_to_add", description: "Enter the time to be removed from the employee", required: true }},
    		{"User": { name: "ping_a_user", description: "Ping a user on who u want to add time to", required: true }}, 
    ],
    run: async (client, interaction) => {
        const {guild, member, customId} = interaction;

        let user = guild.members.cache.get(interaction.options.getUser("ping_a_user").id);
        let time = interaction.options.getString("time_to_add");

        //check if time is valid
        if(ms(time) == undefined) return interaction.reply({
            embeds: [
                new MessageEmbed()
                .setColor(ee.wrongcolor)
                .setDescription(`:x: ${member}, Entered time is invalid, please recheck and try the command again.`)
            ],
            ephemeral: true
        })

        //Fetch department
        let dept = 'corrections'
        
        //process time
        let seconds = ms(time)/1000
        let userfile = JSON.parse(fs.readFileSync(`./database/users/${user.id}.json`))
        userfile.time_log[dept] += seconds
        fs.writeFileSync(`./database/users/${user.id}.json`, JSON.stringify(userfile, null, 2))

        client.channels.cache.get('962548054915952701').send({
            embeds: [
                new MessageEmbed()
                .setDescription(`**[ADD TIME]** **${member}** added **${ms(seconds*1000)}** to **${userfile.details.cityName}** in ${interaction.channel}`)
                .setColor('RANDOM')
                .setFooter(`ID: ${member.user.id}, Tag: ${member.user.tag}`)
            ]
        })

        interaction.reply({
            embeds: [
                new MessageEmbed()
                .setColor(ee.color)
                .setDescription(`${emote.check} Added **${ms(seconds*1000)}** to **${userfile.details.cityName}**`)
            ],
            ephemeral: true
        })
    }
}