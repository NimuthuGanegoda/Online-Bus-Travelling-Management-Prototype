
const supabase = require('../database');

const getAllRoutes = async (req, res) => {
  const { data, error } = await supabase
    .from('routes')
    .select('*');

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json({ data });
};

const getRouteById = async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from('routes')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json({ data });
};

const addRoute = async (req, res) => {
  const { name, description } = req.body;
  const { data, error } = await supabase
    .from('routes')
    .insert([{ name, description }])
    .select();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(201).json({ data });
};

const updateRoute = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  const { data, error } = await supabase
    .from('routes')
    .update({ name, description })
    .eq('id', id)
    .select();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json({ data });
};

const deleteRoute = async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from('routes')
    .delete()
    .eq('id', id)
    .select();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json({ data });
};

module.exports = {
  getAllRoutes,
  getRouteById,
  addRoute,
  updateRoute,
  deleteRoute,
};
