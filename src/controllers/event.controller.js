const { Events } = require('../models');
const fs = require('fs');
const path = require('path');


const createEvent = async (req, res) => {
  try {
    const { title, description, location, date } = req.body;

    // Simpan path file gambar
    const imagePaths = req.files.map(file => `/uploads/${file.filename}`);

    const newEvent = await Events.create({
      title,
      description,
      location,
      date,
      image: imagePaths,
    });

    res.status(201).json(newEvent);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create event', error: error.message });
  }
}

const getAllEvent = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Default halaman pertama
    const limit = parseInt(req.query.limit) || 10; // Default 10 item per halaman
    const offset = (page - 1) * limit;

    const { count, rows } = await Events.findAndCountAll({
      limit,
      offset,
    });

    const totalPages = Math.ceil(count / limit);

    res.status(200).json({
      currentPage: page,
      totalPages,
      totalItems: count,
      data: rows.map((event) => ({
        id: event.id,
        title: event.title,
        description: event.description,
        location: event.location,
        date: event.date,
        image: event.image,
      })),
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve events', error: error.message });
  }
}

const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Events.findByPk(id);

    if (!event) {
      return res.status(404).json({
        msg: `event dengan id ${id} tidak ditemukan`
      });
    }

    // Hapus gambar yang ada di storage (pastikan gambar ada di dalam array event.image)
    if (Array.isArray(event.image) && event.image.length > 0) {
      event.image.forEach(imagePath => {
        const filePath = path.join(__dirname, '../..', 'uploads', imagePath.split('/').pop());
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath); // Menghapus file gambar dari storage
        }
      });
    }

    await event.destroy();
    res.status(200).json({
      message: 'event beserta gambar berhasil dihapus.',
    });
  } catch (error) {
    res.status(500).json({
      message: 'Gagal menghapus event.',
      error: error.message,
    });
  }
};

const editEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      location,
      date,
    } = req.body

    const event = await Events.findByPk(id);
    if (!event) {
      return res.status(404).json({
        message: `event dengan ID ${id} tidak ditemukan.`,
      });
    }

    let imagePaths = event.image; // Gambar lama
    if (req.files && req.files.length > 0) {
      imagePaths = req.files.map(file => `/uploads/${file.filename}`);
    }

    event.title = title || event.title;
    event.description = description || event.description;
    event.location = location || event.location;
    event.date = date || event.date;
    event.image = imagePaths;

    await event.save();

    res.status(200).json({
      message: 'event berhasil diperbarui.',
      data: event,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Gagal memperbarui event.',
      error: error.message,
    });
  }
}

const getEventById = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await Events.findOne({
      where: { id }
    });

    if (data) {
      return res.status(201).json({
        msg: 'retrive data successfuly',
        data
      })
    }

    return res.status(404).json({
      msg: `not data found by id ${id}`
    })

  } catch (error) {
    return res.status(500).json({
      msg: 'Internal server error',
      error: error.message
    })
  }
}

module.exports = {
  getAllEvent,
  getEventById,
  editEvent,
  deleteEvent,
  createEvent
}
