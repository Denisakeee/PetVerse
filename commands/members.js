const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

const db = require("../database");
const Pet = require("../models/Pet");

module.exports = {

data:new SlashCommandBuilder()

.setName("members")

.setDescription("View pet members."),

async execute(interaction){

const pet = await Pet.get(interaction.user.id);

if(!pet){

return interaction.reply({

content:"❌ You don't own a pet.",

ephemeral:true

});

}

const [members] = await db.query(`
SELECT *
FROM pet_members
WHERE pet_id=?
AND accepted=1
`,[pet.id]);

let description = `👑 **Owner:** <@${pet.owner_id}>\n\n`;

if(members.length === 0){

description += "No members.";

}else{

description += "👥 **Members:**\n";

for(const member of members){

description += `• <@${member.user_id}>\n`;

}

}

const embed = new EmbedBuilder()

.setColor("Blue")

.setTitle(`${pet.pet_name}'s Members`)

.setDescription(description);

interaction.reply({

embeds:[embed]

});

}

}