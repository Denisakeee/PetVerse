const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

const db = require("../database");
const Pet = require("../models/Pet");
const getLang = require("../utils/lang");

module.exports = {

    data: new SlashCommandBuilder()
        .setName("wash")
        .setDescription("Wash your pet.")
        .addStringOption(option =>
            option
                .setName("item")
                .setDescription("Choose a cleaning item")
                .setRequired(true)
                .addChoices(
                    { name: "🧼 Soap", value: "Soap" },
                    { name: "🧴 Shampoo", value: "Shampoo" },
                    { name: "🪥 Brush", value: "Brush" }
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

        const item = interaction.options.getString("item");

        const [inventory] = await db.query(
            "SELECT * FROM inventory WHERE owner_id=? AND item=?",
            [pet.owner_id, item]
        );

        if(inventory.length === 0 || inventory[0].amount <= 0){

            return interaction.reply({
                content:`❌ You don't have **${item}**.`,
                ephemeral:true
            });

        }

        let cleanliness = 0;
        let happiness = 0;
        let xp = 0;
        let coins = 0;

        switch(item){

            case "Soap":
                cleanliness = 20;
                happiness = 2;
                xp = 5;
                coins = 2;
                break;

            case "Shampoo":
                cleanliness = 35;
                happiness = 5;
                xp = 10;
                coins = 4;
                break;

            case "Brush":
                cleanliness = 15;
                happiness = 8;
                xp = 8;
                coins = 3;
                break;

        }

        await db.query(
            "UPDATE inventory SET amount=amount-1 WHERE owner_id=? AND item=?",
            [pet.owner_id, item]
        );

        await db.query(`
            UPDATE pets
            SET
            cleanliness = LEAST(100, cleanliness + ?),
            happiness = LEAST(100, happiness + ?),
            xp = xp + ?,
            coins = coins + ?
            WHERE id = ?
        `,[cleanliness, happiness, xp, coins, pet.id]);

        await Pet.checkLevel(pet.owner_id);

        const embed = new EmbedBuilder()

            .setColor("Aqua")
            .setTitle("🛁 Wash")
            .setDescription(lang.wash(pet.pet_name))
            .addFields(
                {
                    name:"Cleaning Item",
                    value:item,
                    inline:true
                },
                {
                    name:"Remaining",
                    value:String(inventory[0].amount - 1),
                    inline:true
                },
                {
                    name:"XP",
                    value:`+${xp}`,
                    inline:true
                }
            );

        interaction.reply({
            embeds:[embed]
        });

    }

};