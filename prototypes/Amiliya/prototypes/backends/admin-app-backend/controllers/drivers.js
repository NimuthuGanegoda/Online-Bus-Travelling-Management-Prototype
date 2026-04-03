const db = require('../database');

const getAllDrivers = (req, res) => {
  db.all('SELECT * FROM drivers', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ data: rows });
  });
};

const getDriverById = (req, res) => {
    const { id } = req.params;
    db.get('SELECT * FROM drivers WHERE id = ?', [id], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ data: row });
    });
};

const addDriver = (req, res) => {
  const { name, contact, busId } = req.body;
  db.run(
    'INSERT INTO drivers (name, contact, busId) VALUES (?, ?, ?)',
    [name, contact, busId],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.status(201).json({ id: this.lastID });
    }
  );
};

const updateDriver = (req, res) => {
  const { id } = req.params;
  const { name, contact, busId } = req.body;
  db.run(
    'UPDATE drivers SET name = ?, contact = ?, busId = ? WHERE id = ?',
    [name, contact, busId, id],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ changes: this.changes });
    }
  );
};

const deleteDriver = (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM drivers WHERE id = ?', id, function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ changes: this.changes });
  });
};

module.exports = {
    getAllDrivers,
    getDriverById,
    addDriver,
    updateDriver,
    deleteDriver,
};
