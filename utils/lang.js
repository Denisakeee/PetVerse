const db = require("../database");

const ro = require("../languages/ro");
const en = require("../languages/en");

module.exports = async (userId) => {

    const [rows] = await db.query(
        "SELECT language FROM users WHERE user_id=?",
        [userId]
    );

    if(rows.length === 0)
        return en;

    return rows[0].language === "ro"
        ? ro
        : en;

};