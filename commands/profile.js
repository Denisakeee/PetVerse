const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

const Pet = require("../models/Pet");

module.exports = {

    data:new SlashCommandBuilder()

    .setName("profile")

    .setDescription("View your profile."),

    async execute(interaction){

        const pet = await Pet.get(interaction.user.id);

        if(!pet){

            return interaction.reply({
                content:"❌ You don't own a pet.",
                ephemeral:true
            });

        }

        const embed = new EmbedBuilder()

        .setColor("Blue")

        .setTitle(`${interaction.user.username}'s Profile`)

        .addFields(

            {
                name:"🐾 Pet",
                value:`${pet.pet_name} (${pet.pet_type})`
            },

            {
                name:"⭐ Level",
                value:String(pet.level),
                inline:true
            },

            {
                name:"✨ XP",
                value:String(pet.xp),
                inline:true
            },

            {
                name:"💰 Coins",
                value:String(pet.coins),
                inline:true
            }

        );

        interaction.reply({
            embeds:[embed]
        });

    }

}