const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

const db = require("../database");
const Pet = require("../models/Pet");
const getLang = require("../utils/lang");

module.exports = {

    data: new SlashCommandBuilder()
        .setName("water")
        .setDescription("Give your pet something to drink.")
        .addStringOption(option =>
            option
                .setName("drink")
                .setDescription("Choose a drink")
                .setRequired(true)
                .addChoices(
                    { name: "💧 Water Bottle", value: "Water Bottle" },
                    { name: "🥛 Milk", value: "Milk" },
                    { name: "🧃 Juice", value: "Juice" }
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

        const drink = interaction.options.getString("drink");

        const [inventory] = await db.query(
            "SELECT * FROM inventory WHERE owner_id=? AND item=?",
            [pet.owner_id, drink]
        );

        if(inventory.length === 0 || inventory[0].amount <= 0){

            return interaction.reply({
                content:`❌ You don't have **${drink}**.`,
                ephemeral:true
            });

        }

        let thirst = 0;
        let health = 0;
        let xp = 0;
        let coins = 0;

        switch(drink){

            case "Water Bottle":
                thirst = 25;
                health = 2;
                xp = 5;
                coins = 2;
                break;

            case "Milk":
                thirst = 20;
                health = 8;
                xp = 10;
                coins = 4;
                break;

            case "Juice":
                thirst = 30;
                health = 5;
                xp = 8;
                coins = 3;
                break;

        }

        await db.query(
            "UPDATE inventory SET amount=amount-1 WHERE owner_id=? AND item=?",
            [pet.owner_id, drink]
        );

        await db.query(`
            UPDATE pets
            SET
            thirst = LEAST(100, thirst + ?),
            health = LEAST(100, health + ?),
            xp = xp + ?,
            coins = coins + ?
            WHERE id = ?
        `,[thirst, health, xp, coins, pet.id]);

        await Pet.checkLevel(pet.owner_id);

        const embed = new EmbedBuilder()
            .setColor("Blue")
            .setTitle("💧 Water")
            .setDescription(lang.water(pet.pet_name))
            .addFields(
                {
                    name:"Drink",
                    value:drink,
                    inline:true
                },
                {
                    name:"Remaining",
                    value:String(inventory[0].amount - 1),
                    inline:true
                }
            );

        interaction.reply({
            embeds:[embed]
        });

    }

};