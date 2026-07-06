const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Shows all PetVerse commands."),

    async execute(interaction) {

        const embed = new EmbedBuilder()
            .setColor("#8A2BE2")
            .setTitle("🐾 PetVerse • Help")
            .setThumbnail(interaction.client.user.displayAvatarURL())
            .setDescription(
`Welcome to **PetVerse**!

Adopt your own virtual pet, take care of it, level it up, buy items and become the best pet owner!

━━━━━━━━━━━━━━━━━━`
            )

            .addFields(

                {
                    name: "🐶 Pet Commands",
                    value:
"`/adopt` • Adopt your first pet\n" +
"`/pet` • View your pet\n" +
"`/feed` • Feed your pet\n" +
"`/water` • Give water\n" +
"`/play` • Play with your pet\n" +
"`/wash` • Wash your pet\n" +
"`/sleep` • Put pet to sleep\n" +
"`/wake` • Wake up your pet",
                    inline: false
                },

                {
                    name: "🛒 Economy",
                    value:
"`/shop` • Open shop\n" +
"`/buy` • Buy items\n" +
"`/inventory` • View inventory\n" +
"`/daily` • Daily reward",
                    inline: false
                },

                {
                    name: "👥 Friends",
                    value:
"`/invite`\n" +
"`/accept`\n" +
"`/uninvite`\n" +
"`/members`",
                    inline: false
                },

                {
                    name: "📊 Profile",
                    value:
"`/profile`\n" +
"`/missions`\n" +
"`/leaderboard`\n" +
"`/language`",
                    inline: false
                },

                {
                    name: "⭐ Tips",
                    value:
"• Feed your pet every day.\n" +
"• Buy better food.\n" +
"• Upgrade your bed.\n" +
"• Complete missions.\n" +
"• Earn coins and XP.",
                    inline: false
                }

            )

            .setFooter({
                text: "PetVerse • Your Pets, Your Adventure 🐾"
            });

        interaction.reply({
            embeds: [embed]
        });

    }
};