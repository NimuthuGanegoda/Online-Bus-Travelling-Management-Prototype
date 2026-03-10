const sqlite3 = require('sqlite3').verbose();

// Use a file for the database
const db = new sqlite3.Database('./driver.db', (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

db.serialize(() => {
  // Create a table to store trip information
  db.run(`
    CREATE TABLE IF NOT EXISTS trips (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      startTime TEXT NOT NULL,
      endTime TEXT,
      passengerCrowd TEXT
    )
  `, (err) => {
    if (err) {
      console.error('Error creating trips table', err.message);
    }
  });
});

module.exports = db;
