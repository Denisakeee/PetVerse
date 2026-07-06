const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

const db = require("../database");
const Pet = require("../models/Pet");

module.exports = {

    data: new SlashCommandBuilder()
        .setName("uninvite")
        .setDescription("Remove a member from your pet.")
        .addUserOption(option =>
            option
                .setName("user")
                .setDescription("Member to remove")
                .setRequired(true)
        ),

    async execute(interaction){

        const pet = await Pet.get(interaction.user.id);

        if(!pet){

            return interaction.reply({
                content:"❌ You don't own a pet.",
                ephemeral:true
            });

        }

        const user = interaction.options.getUser("user");

        const [rows] = await db.query(
            "SELECT * FROM pet_members WHERE pet_id = ? AND user_id = ?",
            [pet.id,user.id]
        );

        if(rows.length === 0){

            return interaction.reply({
                content:"❌ That user isn't a member.",
                ephemeral:true
            });

        }

        await db.query(
            "DELETE FROM pet_members WHERE pet_id = ? AND user_id = ?",
            [pet.id,user.id]
        );

        const embed = new EmbedBuilder()
        .setColor("Red")
        .setTitle("👋 Member Removed")
        .setDescription(`${user.username} no longer has access to **${pet.pet_name}**.`);

        interaction.reply({embeds:[embed]});

    }

}