const { SlashCommandBuilder } = require("discord.js");
const db = require("../database");
const Pet = require("../models/Pet");

module.exports={

data:new SlashCommandBuilder()

.setName("buy")

.setDescription("Buy an item.")

.addStringOption(option=>

option

.setName("item")

.setDescription("Item name")

.setRequired(true)

),

async execute(interaction){

const pet=await Pet.get(interaction.user.id);

if(!pet){

return interaction.reply({

content:"❌ You don't own a pet.",

ephemeral:true

});

}

const itemName=interaction.options.getString("item");

const [rows]=await db.query(

"SELECT * FROM items WHERE name=?",

[itemName]

);

if(rows.length===0){

return interaction.reply({

content:"❌ Item not found.",

ephemeral:true

});

}

const item=rows[0];

if(pet.coins<item.price){

return interaction.reply({

content:"❌ You don't have enough coins.",

ephemeral:true

});

}

await db.query(

"UPDATE pets SET coins=coins-? WHERE owner_id=?",

[item.price,interaction.user.id]

);

await db.query(

`INSERT INTO inventory(owner_id,item,amount)
VALUES(?,?,1)
ON DUPLICATE KEY UPDATE amount=amount+1`,

[interaction.user.id,item.name]

);

interaction.reply(`🛒 You bought **${item.name}** for **${item.price} coins**.`);

}

}