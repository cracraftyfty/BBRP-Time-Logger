const { MessageEmbed } = require("discord.js");
const moment = require("moment-timezone");
const fs = require('fs')
const cap = require('../functions/cap.js')
const ms = require('pretty-ms'); 
const settings = require('../database/settings.json')
module.exports = {
    name: "fetchlogs",
    description: "Gets the Employee Timelog",
    cooldown: 5,
    memberpermissions: [],
    requiredroles: [],
    alloweduserids: ["344915148487786498"],
    options: [],
    run: async (client, interaction) => {
        let user_dir = fs.readdirSync('./database/users')
        
        const {guild, member, customId} = interaction;
        let dept = "Rising Sun Autos"

        let LB_DICT = {}

        user_dir.forEach(file => {
            let user = JSON.parse(fs.readFileSync(`./database/users/${file}`))
            //let member = guild.members.fetch(user.details.discordID)
            if(user.details.cityName){
                LB_DICT[user.details.cityName] = 0
                LB_DICT[user.details.cityName] += user.time_log[dept]*1000        
            }
            else if(user.details.discordTag){
                LB_DICT[user.details.discordTag] = 0
                LB_DICT[user.details.discordTag] += user.time_log[dept]*1000        
            }else{
                LB_DICT[user.details.discordID] = 0
                LB_DICT[user.details.discordID] += user.time_log[dept]*1000
            }
              
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
        /* if(items.length > 20){
            loop = 20
        } */
        
        let logs = client.channels.cache.get('962595123324141628')
        
        const thread = await logs.threads.create({
            name: 'January, 2023',
            reason: 'Monthly Logs for Corrections',
        });

        console.log(`${thread.name} created`)
        
        thread.send({
            embeds: [
                new MessageEmbed()
                .setColor('#953bff')
                .setTitle(`Monthly Logs`)
                .setDescription(`Showing logs for January, 2023`)
            ]
        })
        
        for(i=0;i<loop;i++){
            if(LB_MESSAGE.length >= 4000){
                thread.send({
                    embeds: [
                        new MessageEmbed()
                        .setDescription(LB_MESSAGE)
                        .setColor('#953bff')
                    ]
                })
                LB_MESSAGE = ''
            }
            if(items[i][1] < 900000){
                LB_MESSAGE += `${i+1}- ${settings.emotes.warn} **${cap(items[i][0])}**: ${ms(items[i][1])}\n`
                total_duty_time += items[i][1]
            }else{
                LB_MESSAGE += `${i+1}- **${cap(items[i][0])}**: ${ms(items[i][1])}\n`
                total_duty_time += items[i][1]
            }

            

            if(i === loop-1){
                thread.send({
                    embeds: [
                        new MessageEmbed()
                        .setDescription(LB_MESSAGE)
                        .setColor('#953bff')
                    ]
                })
                LB_MESSAGE = ''
            }

        }
    }
}