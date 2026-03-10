const db = require('../database');

const getAllEmergencies = (req, res) => {
  db.all('SELECT * FROM emergencies ORDER BY timestamp DESC', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ data: rows });
  });
};

const createEmergency = (req, res) => {
    const { busId, message } = req.body;
    db.run(
        'INSERT INTO emergencies (busId, message) VALUES (?, ?)',
        [busId, message],
        function (err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.status(201).json({ id: this.lastID });
        }
    );
};

module.exports = {
    getAllEmergencies,
    createEmergency,
};
