const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

const db = require("../database");
const Pet = require("../models/Pet");
const getLang = require("../utils/lang");

module.exports = {

    data: new SlashCommandBuilder()
        .setName("wake")
        .setDescription("Wake up your pet."),

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

        if(!pet.sleeping){
            return interaction.reply({
                content:"❌ Your pet isn't sleeping.",
                ephemeral:true
            });
        }

        const lang = await getLang(interaction.user.id);

        const hours = (Date.now() - pet.sleep_started) / 3600000;

        let recovered = Math.floor((hours / 8) * pet.sleep_energy);

        if(recovered > pet.sleep_energy)
            recovered = pet.sleep_energy;

        if(recovered < 10)
            recovered = 10;

        let happinessBonus = 0;

        const [bedRows] = await db.query(
            "SELECT item FROM inventory WHERE owner_id=?",
            [pet.owner_id]
        );

        const bed = bedRows.find(x =>
            ["Old Blanket","Basic Bed","Soft Bed","Luxury Bed"].includes(x.item)
        );

        if(bed){

            switch(bed.item){

                case "Old Blanket":
                    happinessBonus = -5;
                    break;

                case "Basic Bed":
                    happinessBonus = 2;
                    break;

                case "Soft Bed":
                    happinessBonus = 5;
                    break;

                case "Luxury Bed":
                    happinessBonus = 10;
                    break;

            }

        }

        await db.query(`
            UPDATE pets
            SET
                sleeping = 0,
                sleep_started = 0,
                energy = LEAST(100, energy + ?),
                happiness = GREATEST(0, LEAST(100, happiness + ?)),
                xp = xp + 20,
                coins = coins + 10
            WHERE id = ?
        `,[
            recovered,
            happinessBonus,
            pet.id
        ]);

        await Pet.checkLevel(pet.owner_id);

        const embed = new EmbedBuilder()

            .setColor("Yellow")

            .setTitle("☀️ Wake Up")

            .setDescription(lang.wake(pet.pet_name))

            .addFields(

                {
                    name:"😴 Energy",
                    value:`+${recovered}`,
                    inline:true
                },

                {
                    name:"😊 Happiness",
                    value:`${happinessBonus >= 0 ? "+" : ""}${happinessBonus}`,
                    inline:true
                },

                {
                    name:"✨ XP",
                    value:"+20",
                    inline:true
                },

                {
                    name:"💰 Coins",
                    value:"+10",
                    inline:true
                }

            );

        interaction.reply({
            embeds:[embed]
        });

    }

};