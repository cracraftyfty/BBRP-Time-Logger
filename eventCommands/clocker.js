module.exports = async (client, interaction) => {
    if(!interaction.isButton()) return
    const {guild, member, customId} = interaction;
    if(!["on", "off"].includes(customId)) return;
    const settings = require('../database/settings.json');
    let emote = settings.emotes


    const clockOn = require(`../functions/clock-on.js`)
    const clockOff = require(`../functions/clock-off.js`)
    
    if(customId === 'on') clockOn(customId, member, client, interaction)
    if(customId === 'off') clockOff(customId, member, client, interaction)
}