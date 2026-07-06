const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

const db = require("../database");
const Pet = require("../models/Pet");
const getLang = require("../utils/lang");

module.exports = {

    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Play with your pet.")
        .addStringOption(option =>
            option
                .setName("toy")
                .setDescription("Choose a toy")
                .setRequired(true)
                .addChoices(
                    { name: "⚽ Ball", value: "Ball" },
                    { name: "🥏 Frisbee", value: "Frisbee" },
                    { name: "🧸 Teddy Bear", value: "Teddy Bear" },
                    { name: "🪢 Rope Toy", value: "Rope Toy" }
                )
        ),

    async execute(interaction){

        let pet = await Pet.get(interaction.user.id);

        if(!pet){
            pet = await Pet.getShared(interaction.user.id);
        }

        if(!pet){
            return interaction.reply({
                content:"❌ You don't own a pet.",
                ephemeral:true
            });
        }

        const lang = await getLang(interaction.user.id);

        const toy = interaction.options.getString("toy");

        const [inventory] = await db.query(
            "SELECT * FROM inventory WHERE owner_id=? AND item=?",
            [pet.owner_id,toy]
        );

        if(inventory.length === 0 || inventory[0].amount <= 0){
            return interaction.reply({
                content:`❌ You don't have **${toy}**.`,
                ephemeral:true
            });
        }

        let happiness = 0;
        let energy = 0;
        let xp = 0;
        let coins = 0;

        switch(toy){

            case "Ball":
                happiness = 20;
                energy = -8;
                xp = 10;
                coins = 4;
                break;

            case "Frisbee":
                happiness = 30;
                energy = -12;
                xp = 15;
                coins = 7;
                break;

            case "Teddy Bear":
                happiness = 15;
                energy = -3;
                xp = 8;
                coins = 2;
                break;

            case "Rope Toy":
                happiness = 25;
                energy = -10;
                xp = 12;
                coins = 5;
                break;

        }

        await db.query(`
            UPDATE pets
            SET
            happiness = LEAST(100,happiness+?),
            energy = GREATEST(0,energy+?),
            xp = xp+?,
            coins = coins+?
            WHERE id=?
        `,[happiness,energy,xp,coins,pet.id]);

        await Pet.checkLevel(pet.owner_id);

        const embed = new EmbedBuilder()

        .setColor("Yellow")

        .setTitle("🎾 Play")

        .setDescription(lang.play(pet.pet_name))

        .addFields(
            {
                name:"Toy",
                value:toy,
                inline:true
            },
            {
                name:"XP",
                value:`+${xp}`,
                inline:true
            },
            {
                name:"Coins",
                value:`+${coins}`,
                inline:true
            }
        );

        interaction.reply({
            embeds:[embed]
        });

    }

}