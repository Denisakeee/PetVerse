const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

const db = require("../database");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("language")
        .setDescription("Change your language")
        .addStringOption(option =>
            option
                .setName("language")
                .setDescription("Choose a language")
                .setRequired(true)
                .addChoices(
                    { name: "🇬🇧 English", value: "en" },
                    { name: "🇷🇴 Română", value: "ro" }
                )
        ),

    async execute(interaction) {

        const language = interaction.options.getString("language");

        await db.query(
            "INSERT INTO users (user_id, language) VALUES (?, ?) ON DUPLICATE KEY UPDATE language = ?",
            [
                interaction.user.id,
                language,
                language
            ]
        );

        const embed = new EmbedBuilder()
            .setColor("Green")
            .setDescription(
                language === "ro"
                    ? "🇷🇴 Limba a fost schimbată în **Română**."
                    : "🇬🇧 Language has been changed to **English**."
            );

        await interaction.reply({
            embeds: [embed]
        });
    }
};