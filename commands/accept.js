const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

const db = require("../database");

module.exports = {

    data: new SlashCommandBuilder()
        .setName("accept")
        .setDescription("Accept a pet invitation."),

    async execute(interaction) {

        const [invite] = await db.query(`
            SELECT
                pet_members.*,
                pets.pet_name,
                pets.pet_type
            FROM pet_members
            JOIN pets ON pets.id = pet_members.pet_id
            WHERE pet_members.user_id = ?
            AND pet_members.accepted = 0
            LIMIT 1
        `,[interaction.user.id]);

        if(invite.length === 0){

            return interaction.reply({
                content:"❌ You don't have any pending invitations.",
                ephemeral:true
            });

        }

        const pet = invite[0];

        await db.query(
            "UPDATE pet_members SET accepted = 1 WHERE id = ?",
            [pet.id]
        );

        const embed = new EmbedBuilder()

        .setColor("Green")

        .setTitle("✅ Invitation Accepted")

        .setDescription(`You are now helping take care of:

🐾 **${pet.pet_name}**
(${pet.pet_type})

You can now use:

🍖 /feed
💧 /water
🎾 /play
🛁 /wash
😴 /sleep

Have fun!`);

        interaction.reply({
            embeds:[embed]
        });

    }

}