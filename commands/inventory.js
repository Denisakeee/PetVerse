const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const db = require("../database");

module.exports={

data:new SlashCommandBuilder()

.setName("inventory")

.setDescription("View your inventory."),

async execute(interaction){

const [items]=await db.query(

"SELECT * FROM inventory WHERE owner_id=?",

[interaction.user.id]

);

if(items.length===0){

return interaction.reply({

content:"🎒 Your inventory is empty."

});

}

const embed=new EmbedBuilder()

.setColor("Blue")

.setTitle("🎒 Inventory");

items.forEach(item=>{

embed.addFields({

name:item.item,

value:`Amount: **${item.amount}**`

});

});

interaction.reply({

embeds:[embed]

});

}

}