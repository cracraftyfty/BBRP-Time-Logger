//here the event starts
const config = require("../../botconfig/config.json")
const { change_status } = require("../../handlers/functions");
module.exports = client => {
  
  try{
    try{
      const stringlength = 69;
      console.log(`[${config.console_tag}] Discord Bot is online!`.bold.brightGreen + ` /--/ ${client.user.tag} /--/ `.bold.brightGreen)

    }catch{ /* */ }
    change_status(client);
    //loop through the status per each 10 minutes
    setInterval(()=>{
      change_status(client);
    }, 15 * 1000);
  
  } catch (e){
    console.log(String(e.stack).grey.italic.dim.bgRed)
  }
}