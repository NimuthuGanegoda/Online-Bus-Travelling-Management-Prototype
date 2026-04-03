const db = require('../database');

const getAllRoutes = (req, res) => {
  db.all('SELECT * FROM routes', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ data: rows });
  });
};

const getRouteById = (req, res) => {
    const { id } = req.params;
    db.get('SELECT * FROM routes WHERE id = ?', [id], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ data: row });
    });
};

const addRoute = (req, res) => {
  const { name, description } = req.body;
  db.run(
    'INSERT INTO routes (name, description) VALUES (?, ?)',
    [name, description],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.status(201).json({ id: this.lastID });
    }
  );
};

const updateRoute = (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  db.run(
    'UPDATE routes SET name = ?, description = ? WHERE id = ?',
    [name, description, id],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ changes: this.changes });
    }
  );
};

const deleteRoute = (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM routes WHERE id = ?', id, function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ changes: this.changes });
  });
};

module.exports = {
    getAllRoutes,
    getRouteById,
    addRoute,
    updateRoute,
    deleteRoute,
};
