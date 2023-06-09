const { MessageEmbed } = require("discord.js");
module.exports = {
  name: "emoteids",
  description: "Send a embed into the Chat",
  cooldown: 5,
  memberpermissions: [],
  requiredroles: [],
  alloweduserids: ["344915148487786498"],
  options: [],
  run: async (client, interaction) => {
    const emojiList = interaction.guild.emojis.cache.map((e, x) => `> ${x} = \\${e} | [${e}] ${e.name}`).join("\n")
    
    interaction.channel.send({embeds: [
        new MessageEmbed()
        .setDescription(emojiList)
    ]})
    
    
  }
}