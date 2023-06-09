//Import Modules
const { MessageEmbed } = require("discord.js");
const ee = require(`../botconfig/embed.json`);
const cap = require('../functions/cap.js');
const settings = require('../database/settings.json');
const fs = require('fs');
const ms = require('pretty-ms');
module.exports = async (client, interaction) => {
    if(!interaction.isButton()) return
    const {guild, member, customId} = interaction;
    if(!["lb"].includes(customId)) return;

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
    if(!userfile.details.cityNumber || !userfile.details.cityName){
        return interaction.reply({
            embeds: [
                new MessageEmbed()
                .setColor('RED')
                .setDescription(`${settings.emotes.wrong} Please setup your **City Name** and **City Phone Number** in the bot using the register button`)
            ], 
            ephemeral: true
        })
    }else{
        let user_dir = fs.readdirSync('./database/users')
        let dept = 'recorded-time'
        let LB_DICT = {}
        user_dir.forEach(file => {
            let user = JSON.parse(fs.readFileSync(`./database/users/${file}`))
            LB_DICT[user.details.cityName] = 0
            LB_DICT[user.details.cityName] += user.time_log[dept]*1000
        })
        var items = Object.keys(LB_DICT).map(function(key) {
            return [key, LB_DICT[key]];
        });
    
        items.sort(function(first, second) {
            return second[1] - first[1];
        });
    
        let total_duty_time = 0
        let LB_MESSAGE = ''
    
        let loop = items.length
        if(items.length > 10){
            loop = 10
        }
        for(i=0;i<loop;i++){
            LB_MESSAGE += `${i+1}) **${cap(items[i][0])}**: ${ms(items[i][1], {verbose: true})}\n`
            total_duty_time += items[i][1]
        }

        interaction.reply({
            embeds: [new MessageEmbed()
                .setTitle(`Time Logger | Leaderboard`)
                .setTimestamp()
                .setThumbnail(interaction.guild.iconURL())
                .setDescription(`Employees have spent a total of **${ms(total_duty_time)}** on duty\n\n${LB_MESSAGE}\n*Leaderboard showing ${loop} out of ${items.length} registered employees*`)
                .setColor('#ad6dfd')
                .setFooter(ee.footertext, ee.footericon)
            ],
            ephemeral: true
        })
    }
}