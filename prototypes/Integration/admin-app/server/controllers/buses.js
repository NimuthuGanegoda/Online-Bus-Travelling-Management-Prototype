
const supabase = require('../database');

const getAllBuses = async (req, res) => {
  const { data, error } = await supabase
    .from('buses')
    .select('*');

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json({ data });
};

const getBusById = async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from('buses')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json({ data });
};

const addBus = async (req, res) => {
  const { busNo, driverName, route } = req.body;
  const { data, error } = await supabase
    .from('buses')
    .insert([{ busNo, driverName, route }])
    .select();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(201).json({ data });
};

const updateBus = async (req, res) => {
  const { id } = req.params;
  const { busNo, driverName, route } = req.body;

  const { data, error } = await supabase
    .from('buses')
    .update({ busNo, driverName, route })
    .eq('id', id)
    .select();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json({ data });
};

const deleteBus = async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from('buses')
    .delete()
    .eq('id', id)
    .select();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json({ data });
};

module.exports = {
  getAllBuses,
  getBusById,
  addBus,
  updateBus,
  deleteBus,
};
