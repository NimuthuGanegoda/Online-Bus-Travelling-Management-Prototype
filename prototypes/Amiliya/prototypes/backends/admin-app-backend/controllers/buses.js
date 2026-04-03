const db = require('../database');

const getAllBuses = (req, res) => {
  db.all('SELECT * FROM buses', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ data: rows });
  });
};

const getBusById = (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM buses WHERE id = ?', [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ data: row });
  });
};

const addBus = (req, res) => {
  const { busNo, driverName, route } = req.body;
  db.run(
    'INSERT INTO buses (busNo, driverName, route) VALUES (?, ?, ?)',
    [busNo, driverName, route],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.status(201).json({ id: this.lastID });
    }
  );
};

const updateBus = (req, res) => {
  const { id } = req.params;
  const { busNo, driverName, route } = req.body;
  db.run(
    'UPDATE buses SET busNo = ?, driverName = ?, route = ? WHERE id = ?',
    [busNo, driverName, route, id],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ changes: this.changes });
    }
  );
};

const deleteBus = (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM buses WHERE id = ?', id, function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ changes: this.changes });
  });
};

module.exports = {
  getAllBuses,
  getBusById,
  addBus,
  updateBus,
  deleteBus,
};
