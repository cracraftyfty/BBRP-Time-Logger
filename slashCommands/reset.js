const moment = require("moment-timezone");
const fs = require('fs');
module.exports = {
    name: "reset",
    description: "reset", 
    cooldown: 5,
    memberpermissions: [], 
    requiredroles: [],
    alloweduserids: ["344915148487786498"],
    options: [ 
    		{"String": { name: "month", description: "what month", required: true }},
    ],
    run: async (client, interaction) => {

        const {guild, member, customId} = interaction;

        let MONTH = interaction.options.getString('month')
        //return interaction.reply(MONTH)

        let staff_dir = fs.readdirSync('./database/users')
        
        let msg = ''
        let total_timer = 0

        await staff_dir.forEach(file => {
            let userfile = JSON.parse(fs.readFileSync(`./database/users/${file}`))
            userfile.prior_months[MONTH]
            userfile.prior_months[MONTH] = userfile.time_log.corrections
            userfile.time_log = {
                "recorded-time": 0
            }
            fs.writeFileSync(`./database/users/${file}`, JSON.stringify(userfile, null, 4))
        })
    }
}