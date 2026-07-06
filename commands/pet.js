const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

const Pet = require("../models/Pet");

module.exports = {

data:new SlashCommandBuilder()

.setName("pet")

.setDescription("View your pet"),

async execute(interaction){

const pet = await Pet.get(interaction.user.id);

if(!pet){

return interaction.reply({

content:"❌ You don't own a pet.\nUse **/adopt**",

ephemeral:true

});

}

const embed = new EmbedBuilder()

.setColor("Blue")

.setTitle(`${pet.pet_name} | ${pet.pet_type}`)

.setDescription(`
❤️ Health: **${pet.health}**

🍖 Hunger: **${pet.hunger}**

💧 Thirst: **${pet.thirst}**

😴 Energy: **${pet.energy}**

🧼 Cleanliness: **${pet.cleanliness}**

🎉 Happiness: **${pet.happiness}**

⭐ Level **${pet.level}**

XP: **${pet.xp}**

💰 Coins: **${pet.coins}**
`);

interaction.reply({

embeds:[embed]

});

}

}