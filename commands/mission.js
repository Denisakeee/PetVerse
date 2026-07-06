const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

module.exports = {

    data: new SlashCommandBuilder()
        .setName("missions")
        .setDescription("View today's missions."),

    async execute(interaction){

        const embed = new EmbedBuilder()

        .setColor("Purple")

        .setTitle("🎯 Daily Missions")

        .setDescription(`
🍖 Feed your pet **5** times
Reward: 💰150 Coins | ✨50 XP

💧 Give water **5** times
Reward: 💰150 Coins | ✨50 XP

🎾 Play **3** times
Reward: 💰200 Coins | ✨75 XP

🛁 Wash your pet **2** times
Reward: 💰100 Coins | ✨30 XP

😴 Put your pet to sleep
Reward: 💰250 Coins | ✨100 XP
`);

        interaction.reply({
            embeds:[embed]
        });

    }

}