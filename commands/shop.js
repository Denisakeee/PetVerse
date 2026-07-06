const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const db = require("../database");

module.exports = {

data:new SlashCommandBuilder()

.setName("shop")

.setDescription("View the pet shop."),

async execute(interaction){

const [items]=await db.query("SELECT * FROM items");

const embed=new EmbedBuilder()

.setColor("Green")

.setTitle("🛒 Pet Shop");

items.forEach(item=>{

embed.addFields({

name:`${item.name} - 💰 ${item.price}`,

value:`Category: ${item.type}\nValue: +${item.value}`

});

});

interaction.reply({

embeds:[embed]

});

}

}