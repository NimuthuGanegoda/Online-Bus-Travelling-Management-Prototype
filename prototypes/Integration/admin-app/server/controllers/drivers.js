
const supabase = require('../database');

const getAllDrivers = async (req, res) => {
  const { data, error } = await supabase
    .from('drivers')
    .select('*');

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json({ data });
};

const getDriverById = async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from('drivers')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json({ data });
};

const addDriver = async (req, res) => {
  const { name, contact, busId } = req.body;
  const { data, error } = await supabase
    .from('drivers')
    .insert([{ name, contact, busId }])
    .select();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(201).json({ data });
};

const updateDriver = async (req, res) => {
  const { id } = req.params;
  const { name, contact, busId } = req.body;

  const { data, error } = await supabase
    .from('drivers')
    .update({ name, contact, busId })
    .eq('id', id)
    .select();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json({ data });
};

const deleteDriver = async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from('drivers')
    .delete()
    .eq('id', id)
    .select();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json({ data });
};

module.exports = {
  getAllDrivers,
  getDriverById,
  addDriver,
  updateDriver,
  deleteDriver,
};
