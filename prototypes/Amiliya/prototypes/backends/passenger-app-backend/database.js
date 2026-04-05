const sqlite3 = require('sqlite3').verbose();

// Use a file for the database
const db = new sqlite3.Database('./passenger.db', (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

db.serialize(() => {
  // Create a table to store bus location (this is a simplified mock)
  db.run(`
    CREATE TABLE IF NOT EXISTS bus_locations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      busId TEXT NOT NULL,
      latitude REAL NOT NULL,
      longitude REAL NOT NULL
    )
  `, (err) => {
    if (err) {
      console.error('Error creating bus_locations table', err.message);
    }
  });
});

module.exports = db;
