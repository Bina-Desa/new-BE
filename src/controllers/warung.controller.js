const { Warung } = require('../models');

// Create a Warung
const createWarung = async (req, res) => {
  try {
    const { name, address } = req.body;
    const warung = await Warung.create({ name, address });
    res.status(201).json(warung);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get All Warungs
const getAllWarungs = async (req, res) => {
  try {
    const warungs = await Warung.findAll();
    res.status(200).json(warungs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a Warung
const updateWarung = async (req, res) => {
  try {
    const { id } = req.params; // ID dari warung
    const { name, address } = req.body; // Data yang akan diupdate

    const warung = await Warung.findByPk(id);
    if (!warung) {
      return res.status(404).json({ message: 'Warung not found' });
    }

    // Update data
    await warung.update({ name, address });
    res.status(200).json(warung);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a Warung
const deleteWarung = async (req, res) => {
  try {
    const { id } = req.params; // ID dari warung

    const warung = await Warung.findByPk(id);
    if (!warung) {
      return res.status(404).json({ message: 'Warung not found' });
    }

    // Hapus warung
    await warung.destroy();
    res.status(200).json({ message: 'Warung deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports = {
  createWarung,
  updateWarung,
  getAllWarungs,
  deleteWarung,
}
