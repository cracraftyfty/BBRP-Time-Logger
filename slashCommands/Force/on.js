const fs = require('fs');
module.exports = {
    name: "on",
    description: "Forcefully clocks on an employee",
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
    		{"User": { name: "ping_a_user", description: "Ping a user to forcefully Clock On", required: true }},
    ],
    run: async (client, interaction) => {
        const {guild} = interaction;

        let member = await guild.members.cache.get(interaction.options.getUser("ping_a_user").id)

        const clockOn = require(`../../functions/clock-on.js`)
        clockOn('on', member, client, interaction)
    }
}