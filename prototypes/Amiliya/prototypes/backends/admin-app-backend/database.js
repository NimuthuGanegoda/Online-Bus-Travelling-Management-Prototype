const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./admin.db', (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log('Connected to the SQLite database for the admin panel.');
  }
});

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS buses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      busNo TEXT NOT NULL,
      driverName TEXT NOT NULL,
      route TEXT NOT NULL
    )
  `, (err) => {
    if (err) {
      console.error('Error creating buses table', err.message);
    }
  });

  db.run(`
    CREATE TABLE IF NOT EXISTS emergencies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      busId INTEGER,
      message TEXT NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (busId) REFERENCES buses(id)
    )
  `, (err) => {
    if (err) {
      console.error('Error creating emergencies table', err.message);
    }
  });

  db.run(`
    CREATE TABLE IF NOT EXISTS routes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT
    )
  `, (err) => {
    if (err) {
      console.error('Error creating routes table', err.message);
    }
  });

  db.run(`
    CREATE TABLE IF NOT EXISTS drivers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      contact TEXT NOT NULL,
      busId INTEGER,
      FOREIGN KEY (busId) REFERENCES buses(id)
    )
  `, (err) => {
    if (err) {
      console.error('Error creating drivers table', err.message);
    }
  });
});

module.exports = db;
