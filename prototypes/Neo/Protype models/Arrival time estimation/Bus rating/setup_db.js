const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');

db.serialize(() => {
    db.run("DROP TABLE IF EXISTS comments");
    db.run(`CREATE TABLE comments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        driver_name TEXT,
        comment TEXT
    )`);

    const stmt = db.prepare("INSERT INTO comments (driver_name, comment) VALUES (?, ?)");

    // Driver A - Bad Driver's negative comments 
    stmt.run("Driver_A", "The driver was not in a good state of mind");
    stmt.run("Driver_A", "He was constantly speaking rude things to my friend.");
    stmt.run("Driver_A", "The driver disregarded most of the traffic rules.");
    
    
    // Driver B - Good Driver's good comments 
    stmt.run("Driver_B", "He was very patient with us.");
    stmt.run("Driver_B", "He did not mind that we want to keep conversation to a minimum");
    stmt.run("Driver_B", "He abide by the road rules correctly.");

    stmt.finalize();
    console.log("Database updated with Driver_A and Driver_B.");
});
db.close();