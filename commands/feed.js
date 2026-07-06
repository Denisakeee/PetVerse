const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

const db = require("../database");
const Pet = require("../models/Pet");
const getLang = require("../utils/lang");

module.exports = {

    data: new SlashCommandBuilder()
        .setName("feed")
        .setDescription("Feed your pet.")
        .addStringOption(option =>
            option
                .setName("food")
                .setDescription("Choose food")
                .setRequired(true)
                .addChoices(
                    { name: "🍖 Dog Food", value: "Dog Food" },
                    { name: "🍎 Apple", value: "Apple" }
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

        const food = interaction.options.getString("food");

        const [inventory] = await db.query(
            "SELECT * FROM inventory WHERE owner_id=? AND item=?",
            [pet.owner_id, food]
        );

        if(inventory.length === 0 || inventory[0].amount <= 0){

            return interaction.reply({
                content:`❌ You don't have **${food}**.`,
                ephemeral:true
            });

        }

        let hunger = 0;
        let health = 0;
        let xp = 0;
        let coins = 0;

        switch(food){

            case "Dog Food":
                hunger = 25;
                health = 5;
                xp = 10;
                coins = 3;
                break;

            case "Apple":
                hunger = 10;
                health = 2;
                xp = 5;
                coins = 1;
                break;

        }

        await db.query(
            "UPDATE inventory SET amount=amount-1 WHERE owner_id=? AND item=?",
            [pet.owner_id, food]
        );

        await db.query(`
            UPDATE pets
            SET
            hunger=LEAST(100,hunger+?),
            health=LEAST(100,health+?),
            xp=xp+?,
            coins=coins+?
            WHERE id=?
        `,[hunger,health,xp,coins,pet.id]);

        await Pet.checkLevel(pet.owner_id);

        const embed = new EmbedBuilder()

            .setColor("Green")
            .setTitle("🍖 Feed")
            .setDescription(lang.feed(pet.pet_name))
            .addFields(
                {
                    name:"Food",
                    value:food,
                    inline:true
                },
                {
                    name:"Remaining",
                    value:String(inventory[0].amount-1),
                    inline:true
                }
            );

        interaction.reply({
            embeds:[embed]
        });

    }

};