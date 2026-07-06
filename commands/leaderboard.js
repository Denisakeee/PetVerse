const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

const db = require("../database");

module.exports = {

    data:new SlashCommandBuilder()

    .setName("leaderboard")

    .setDescription("Top PetVerse players."),

    async execute(interaction){

        const [rows] = await db.query(`
            SELECT *
            FROM pets
            ORDER BY level DESC,xp DESC
            LIMIT 10
        `);

        let text = "";

        for(let i=0;i<rows.length;i++){

            text += `**${i+1}.** <@${rows[i].owner_id}> • Level ${rows[i].level} • 💰${rows[i].coins}\n`;

        }

        const embed = new EmbedBuilder()

        .setColor("Gold")

        .setTitle("🏆 PetVerse Leaderboard")

        .setDescription(text || "Nobody yet.");

        interaction.reply({
            embeds:[embed]
        });

    }

}