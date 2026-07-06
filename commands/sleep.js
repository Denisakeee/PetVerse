const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

const db = require("../database");
const Pet = require("../models/Pet");
const getLang = require("../utils/lang");

module.exports = {

    data: new SlashCommandBuilder()
        .setName("sleep")
        .setDescription("Put your pet to sleep.")
        .addStringOption(option =>
            option
                .setName("bed")
                .setDescription("Choose a bed")
                .setRequired(true)
                .addChoices(
                    { name: "🪵 Old Blanket", value: "Old Blanket" },
                    { name: "🛏 Basic Bed", value: "Basic Bed" },
                    { name: "🛌 Soft Bed", value: "Soft Bed" },
                    { name: "👑 Luxury Bed", value: "Luxury Bed" }
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

        if(pet.sleeping){
            return interaction.reply({
                content:"😴 Your pet is already sleeping.",
                ephemeral:true
            });
        }

        const lang = await getLang(interaction.user.id);

        const bed = interaction.options.getString("bed");

        const [inventory] = await db.query(
            "SELECT * FROM inventory WHERE owner_id=? AND item=?",
            [pet.owner_id, bed]
        );

        if(inventory.length === 0){

            return interaction.reply({
                content:`❌ You don't own **${bed}**.`,
                ephemeral:true
            });

        }

        let energy = 35;

        switch(bed){

            case "Old Blanket":
                energy = 35;
                break;

            case "Basic Bed":
                energy = 60;
                break;

            case "Soft Bed":
                energy = 80;
                break;

            case "Luxury Bed":
                energy = 100;
                break;

        }

        await db.query(`
            UPDATE pets
            SET
            sleeping=1,
            sleep_started=?,
            sleep_energy=?
            WHERE id=?
        `,[
            Date.now(),
            energy,
            pet.id
        ]);

        const embed = new EmbedBuilder()

        .setColor("DarkBlue")

        .setTitle("🌙 Sleep")

        .setDescription(lang.sleep(pet.pet_name))

        .addFields(
            {
                name:"🛏 Bed",
                value:bed,
                inline:true
            },
            {
                name:"😴 Energy Recovery",
                value:`${energy}%`,
                inline:true
            }
        );

        interaction.reply({
            embeds:[embed]
        });

    }

};