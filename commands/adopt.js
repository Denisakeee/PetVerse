const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

const Pet = require("../models/Pet");
const db = require("../database");

module.exports = {

    data: new SlashCommandBuilder()
        .setName("adopt")
        .setDescription("Adopt a pet.")
        .addStringOption(option =>
            option
                .setName("animal")
                .setDescription("Choose your pet")
                .setRequired(true)
                .addChoices(
                    { name:"🐶 Dog", value:"Dog"},
                    { name:"🐱 Cat", value:"Cat"},
                    { name:"🐰 Rabbit", value:"Rabbit"},
                    { name:"🦊 Fox", value:"Fox"},
                    { name:"🐺 Wolf", value:"Wolf"},
                    { name:"🐼 Panda", value:"Panda"},
                    { name:"🦁 Lion", value:"Lion"},
                    { name:"🐧 Penguin", value:"Penguin"},
                    { name:"🐹 Hamster", value:"Hamster"},
                    { name:"🦄 Unicorn", value:"Unicorn"},
                    { name:"🐉 Dragon", value:"Dragon"}
                )
        )
        .addStringOption(option =>
            option
                .setName("name")
                .setDescription("Pet name")
                .setRequired(true)
        ),

    async execute(interaction){

        const exists = await Pet.get(interaction.user.id);

        if(exists){
            return interaction.reply({
                content:"❌ You already own a pet.",
                ephemeral:true
            });
        }

        const animal = interaction.options.getString("animal");
        const name = interaction.options.getString("name");

        await Pet.create(
            interaction.user.id,
            name,
            animal
        );

        // 🎁 Starter Pack
        await db.query(
            "INSERT INTO inventory (owner_id, item, amount) VALUES (?, ?, ?)",
            [interaction.user.id, "Dog Food", 1]
        );

        await db.query(
            "INSERT INTO inventory (owner_id, item, amount) VALUES (?, ?, ?)",
            [interaction.user.id, "Water Bottle", 5]
        );

        await db.query(
            "INSERT INTO inventory (owner_id, item, amount) VALUES (?, ?, ?)",
            [interaction.user.id, "Apple", 5]
        );

        await db.query(
            "INSERT INTO inventory (owner_id, item, amount) VALUES (?, ?, ?)",
            [interaction.user.id, "Old Blanket", 1]
        );

        const embed = new EmbedBuilder()

            .setColor("Green")

            .setTitle("🎉 Pet Adopted!")

            .setDescription(
`Congratulations!

You adopted a **${animal}**

Name: **${name}**

❤️ Health: 100
🍖 Hunger: 100
💧 Thirst: 100
😴 Energy: 100
🧼 Cleanliness: 100
🎉 Happiness: 100

⭐ Level: 1
💰 Coins: 500`
)

            .addFields({
                name: "🎁 Starter Pack",
                value:
`🦴 Dog Food ×1
💧 Water Bottle ×5
🍎 Apple ×5
🛏️ Old Blanket ×1`
            })

            .setFooter({
                text: "Welcome to PetVerse! 🐾"
            });

        interaction.reply({
            embeds:[embed]
        });

    }

};