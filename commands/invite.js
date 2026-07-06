const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

const db = require("../database");
const Pet = require("../models/Pet");

module.exports = {

    data: new SlashCommandBuilder()
        .setName("invite")
        .setDescription("Invite someone to take care of your pet.")
        .addUserOption(option =>
            option
                .setName("user")
                .setDescription("User to invite")
                .setRequired(true)
        ),

    async execute(interaction) {

        const pet = await Pet.get(interaction.user.id);

        if (!pet) {
            return interaction.reply({
                content: "❌ You don't own a pet.",
                ephemeral: true
            });
        }

        const user = interaction.options.getUser("user");

        if (user.id === interaction.user.id) {
            return interaction.reply({
                content: "❌ You can't invite yourself.",
                ephemeral: true
            });
        }

        const [already] = await db.query(
            "SELECT * FROM pet_members WHERE pet_id = ? AND user_id = ?",
            [pet.id, user.id]
        );

        if (already.length > 0) {
            return interaction.reply({
                content: "❌ This user already has a pending invite or is already a member.",
                ephemeral: true
            });
        }

        await db.query(
            "INSERT INTO pet_members (pet_id, user_id, accepted) VALUES (?, ?, 0)",
            [pet.id, user.id]
        );

        const embed = new EmbedBuilder()
            .setColor("Green")
            .setTitle("📨 Invitation Sent")
            .setDescription(
                `You invited **${user.username}** to help take care of **${pet.pet_name}**.\n\nThey must use **/accept** to join.`
            );

        await interaction.reply({
            embeds: [embed]
        });

    }

};