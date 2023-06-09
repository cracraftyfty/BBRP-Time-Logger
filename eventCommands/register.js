const { Modal, TextInputComponent, showModal } = require("discord-modals");
const discordModals = require('discord-modals');
module.exports = async (client, interaction) => {
    if(!interaction.isButton()) return
    const {guild, member, customId} = interaction;
    if(!['register'].includes(customId)) return;    

    let comps = [
            new TextInputComponent()
                .setCustomId("cityname")
                .setLabel("City Name")
                .setStyle("SHORT")
                .setMinLength(3)
                .setMaxLength(150)
                .setPlaceholder("What is your City Name?")
                .setRequired(true), 
            new TextInputComponent() 
                .setCustomId("citynumber")
                .setLabel("City Number")
                .setStyle("SHORT")
                .setMinLength(3)
                .setMaxLength(20)
                .setPlaceholder("What is your City Number?")
                .setRequired(true),
            new TextInputComponent() 
                .setCustomId("steamname")
                .setLabel("Steam Name")
                .setStyle("SHORT")
                .setMinLength(3)
                .setMaxLength(150)
                .setPlaceholder("What is your steam name?")
                .setRequired(true)
    ]

    discordModals(client);
    const modal = new Modal() 
    .setCustomId(`register+${member.id}`)
    .setTitle("Time Logger | Employee Registration")
    .addComponents(comps);
    await showModal(modal, {
        client: client,
        interaction: interaction
    }).catch(e => {
        console.log(e.message ? e.message : e);
    })
}