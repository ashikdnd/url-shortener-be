const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./urls.db', (error) => {
    if (error) {
        console.log('Unable to create or read database');
    } else {
        db.run(
            `CREATE TABLE IF NOT EXISTS urls (
                    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                    shortId TEXT UNIQUE,
                    longUrl TEXT
                );`
        )
    }
});

module.exports = db;