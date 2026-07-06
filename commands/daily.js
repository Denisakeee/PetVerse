const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

const db = require("../database");
const Pet = require("../models/Pet");

module.exports = {

data:new SlashCommandBuilder()

.setName("daily")

.setDescription("Claim your daily reward."),

async execute(interaction){

const pet = await Pet.get(interaction.user.id);

if(!pet){

return interaction.reply({

content:"❌ You don't own a pet.",

ephemeral:true

});

}

const [rows]=await db.query(

"SELECT daily FROM pets WHERE owner_id=?",

[interaction.user.id]

);

const last = rows[0].daily || 0;

const now = Date.now();

const cooldown = 86400000;

if(now-last<cooldown){

const remaining = cooldown-(now-last);

const hours = Math.floor(remaining/3600000);

const minutes = Math.floor((remaining%3600000)/60000);

return interaction.reply({

content:`⏳ Come back in **${hours}h ${minutes}m**.`,

ephemeral:true

});

}

await db.query(`
UPDATE pets
SET
coins=coins+500,
xp=xp+100,
daily=?
WHERE owner_id=?
`,[
now,
interaction.user.id
]);

await Pet.checkLevel(interaction.user.id);

const embed = new EmbedBuilder()

.setColor("Gold")

.setTitle("🎁 Daily Reward")

.setDescription(`You received:

💰 **500 Coins**

✨ **100 XP**

Come back tomorrow!`);

interaction.reply({

embeds:[embed]

});

}

}