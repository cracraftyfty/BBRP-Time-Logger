const fs = require('fs');
const settings = JSON.parse(fs.readFileSync('./database/settings.json'));
module.exports = {
    name: "off",
    description: "Forcefully clocks off an employee",
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
    		{"User": { name: "ping_a_user", description: "Ping a user to forcefully Clock Off", required: true }},
    ],
    run: async (client, interaction) => {
        const {guild} = interaction;

        let member = await guild.members.cache.get(interaction.options.getUser("ping_a_user").id)

        const clockOff = require(`../../functions/clock-off.js`)
        clockOff('off', member, client, interaction)
    }
}