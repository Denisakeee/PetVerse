const db = require("../database");

class Pet {

    // Găsește pet-ul proprietarului
    static async get(ownerId) {

        const [rows] = await db.query(
            "SELECT * FROM pets WHERE owner_id = ?",
            [ownerId]
        );

        return rows[0];

    }

    // Găsește pet-ul la care utilizatorul este membru
    static async getShared(userId){

        const [rows] = await db.query(`
            SELECT pets.*
            FROM pet_members
            JOIN pets
            ON pets.id = pet_members.pet_id
            WHERE
            pet_members.user_id = ?
            AND pet_members.accepted = 1
            LIMIT 1
        `,[userId]);

        return rows[0];

    }

    // Creează un pet nou
    static async create(ownerId, name, type){

        await db.query(`
            INSERT INTO pets
            (
                owner_id,
                pet_name,
                pet_type,
                level,
                xp,
                coins,
                health,
                hunger,
                thirst,
                energy,
                happiness,
                cleanliness,
                sleeping,
                sleep_started
            )
            VALUES
            (?, ?, ?, 1, 0, 500, 100, 100, 100, 100, 100, 100, 0, 0)
        `,[ownerId,name,type]);

    }

    // Mărește o statistică (maxim 100)
    static async updateStat(ownerId, stat, amount){

        await db.query(`
            UPDATE pets
            SET ${stat} = LEAST(100, ${stat} + ?)
            WHERE owner_id = ?
        `,[amount,ownerId]);

    }

    // Scade o statistică (minim 0)
    static async removeStat(ownerId, stat, amount){

        await db.query(`
            UPDATE pets
            SET ${stat} = GREATEST(0, ${stat} - ?)
            WHERE owner_id = ?
        `,[amount,ownerId]);

    }

    // Adaugă XP și Coins
    static async addXP(ownerId,xp,coins){

        await db.query(`
            UPDATE pets
            SET
            xp = xp + ?,
            coins = coins + ?
            WHERE owner_id = ?
        `,[xp,coins,ownerId]);

    }

    // Setează energia
    static async setEnergy(ownerId,value){

        await db.query(`
            UPDATE pets
            SET energy = ?
            WHERE owner_id = ?
        `,[value,ownerId]);

    }

    // Pune la somn
    static async sleep(ownerId){

        await db.query(`
            UPDATE pets
            SET
            sleeping = 1,
            sleep_started = ?
            WHERE owner_id = ?
        `,[Date.now(),ownerId]);

    }

    // Trezește pet-ul
    static async wake(ownerId,energy){

        await db.query(`
            UPDATE pets
            SET
            sleeping = 0,
            sleep_started = 0,
            energy = ?
            WHERE owner_id = ?
        `,[energy,ownerId]);

    }

    // Adaugă coins
    static async addCoins(ownerId,amount){

        await db.query(`
            UPDATE pets
            SET coins = coins + ?
            WHERE owner_id = ?
        `,[amount,ownerId]);

    }

    // Elimină coins
    static async removeCoins(ownerId,amount){

        await db.query(`
            UPDATE pets
            SET coins = coins - ?
            WHERE owner_id = ?
        `,[amount,ownerId]);

    }

    // Level Up automat
    static async checkLevel(ownerId){

        const pet = await this.get(ownerId);

        if(!pet) return;

        const neededXP = pet.level * 100;

        if(pet.xp >= neededXP && pet.level < 100){

            await db.query(`
                UPDATE pets
                SET
                level = level + 1,
                xp = xp - ?
                WHERE owner_id = ?
            `,[neededXP,ownerId]);

        }

    }

}

module.exports = Pet;