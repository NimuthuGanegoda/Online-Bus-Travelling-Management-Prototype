
const supabase = require('../database');

const getAllEmergencies = async (req, res) => {
  const { data, error } = await supabase
    .from('emergencies')
    .select('*')
    .order('timestamp', { ascending: false });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json({ data });
};

const createEmergency = async (req, res) => {
  const { busId, message } = req.body;
  const { data, error } = await supabase
    .from('emergencies')
    .insert([{ busId, message }])
    .select();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(201).json({ data });
};

module.exports = {
  getAllEmergencies,
  createEmergency,
};
