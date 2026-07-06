const {
    SlashCommandBuilder,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

const db = require("../database");
const Pet = require("../models/Pet");

module.exports = {

    data: new SlashCommandBuilder()
        .setName("abandon")
        .setDescription("Abandon your pet."),

    async execute(interaction) {

        const pet = await Pet.get(interaction.user.id);

        if (!pet) {
            return interaction.reply({
                content: "❌ You don't own a pet.",
                ephemeral: true
            });
        }

        const embed = new EmbedBuilder()
            .setColor("Red")
            .setTitle("⚠️ Abandon Pet")
            .setDescription(
`Are you sure you want to abandon **${pet.pet_name}**?

❗ This action cannot be undone.`
            );

        const row = new ActionRowBuilder().addComponents(

            new ButtonBuilder()
                .setCustomId("abandon_yes")
                .setLabel("Yes")
                .setStyle(ButtonStyle.Danger),

            new ButtonBuilder()
                .setCustomId("abandon_no")
                .setLabel("No")
                .setStyle(ButtonStyle.Secondary)

        );

        const msg = await interaction.reply({
            embeds: [embed],
            components: [row],
            fetchReply: true
        });

        const collector = msg.createMessageComponentCollector({
            time: 30000
        });

        collector.on("collect", async i => {

            if (i.user.id !== interaction.user.id)
                return i.reply({
                    content: "❌ This isn't your menu.",
                    ephemeral: true
                });

            if (i.customId === "abandon_no") {

                collector.stop();

                return i.update({
                    content: "❌ Cancelled.",
                    embeds: [],
                    components: []
                });

            }

            if (i.customId === "abandon_yes") {

                await db.query(
                    "DELETE FROM pets WHERE owner_id=?",
                    [interaction.user.id]
                );

                await db.query(
                    "DELETE FROM inventory WHERE owner_id=?",
                    [interaction.user.id]
                );

                collector.stop();

                return i.update({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("Green")
                            .setTitle("💔 Pet Abandoned")
                            .setDescription(
`You abandoned your pet.

You can adopt a new one anytime using **/adopt**.`
                            )
                    ],
                    components: []
                });

            }

        });

    }

};