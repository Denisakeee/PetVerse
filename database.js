const mysql = require("mysql2/promise");

const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "", // Dacă ai parolă în XAMPP, pune-o aici
    database: "petverse",

    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

(async () => {
    try {
        const connection = await db.getConnection();
        console.log("🟢 Connected to MySQL!");
        connection.release();
    } catch (err) {
        console.error("🔴 MySQL Error:", err);
    }
})();

module.exports = db;