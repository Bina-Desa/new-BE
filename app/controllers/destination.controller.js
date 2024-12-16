const { Destination } = require('../models');
const fs = require('fs');
const path = require('path');

const getDestinationById = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await Destination.findOne({
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

const getAllDestionation = async (req, res) => {
  try {
    // Ambil parameter query untuk pagination
    const page = parseInt(req.query.page) || 1; // Default halaman pertama
    const limit = parseInt(req.query.limit) || 10; // Default 10 item per halaman
    const offset = (page - 1) * limit;

    // Ambil data dengan limit dan offset
    const { count, rows } = await Destination.findAndCountAll({
      limit,
      offset,
    });

    // Format respons
    const totalPages = Math.ceil(count / limit);

    res.status(200).json({
      currentPage: page,
      totalPages,
      totalItems: count,
      data: rows.map((destinasi) => ({
        id: destinasi.id,
        name: destinasi.name,
        category: destinasi.category,
        location: {
          latitude: destinasi.latitude,
          longitude: destinasi.longitude,
          gmaps: destinasi.gmaps,
        },
        shortdeskripsi: destinasi.shortdeskripsi,
        longdeskripsi: destinasi.longdeskripsi,
        image: destinasi.image,
        fasilitas: destinasi.fasilitas,
      })),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
const uploadDestination = async (req, res) => {
  try {
    // Ambil data dari body dan file yang diunggah
    const {
      name,
      category,
      latitude,
      longitude,
      gmaps,
      shortdeskripsi,
      longdeskripsi,
      fasilitas,
    } = req.body;

    // Proses file gambar yang diunggah
    const imagePaths = req.files.map(file => `/uploads/${file.filename}`);

    // Simpan data destinasi baru ke database
    const destinasi = await Destination.create({
      name,
      category,
      latitude,
      longitude,
      gmaps,
      shortdeskripsi,
      longdeskripsi,
      image: imagePaths, // Array URL gambar
      fasilitas: fasilitas ? JSON.parse(fasilitas) : [], // Fasilitas dalam bentuk array
    });

    res.status(201).json({
      message: 'Destinasi berhasil ditambahkan.',
      data: destinasi,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Gagal menambahkan destinasi.',
      error: error.message,
    });
  }
};
const deleteDestination = async (req, res) => {
  const { id } = req.params;

  try {
    // Cari destinasi berdasarkan ID
    const destinasi = await Destination.findByPk(id);
    if (!destinasi) {
      return res.status(404).json({
        message: `Destinasi dengan ID ${id} tidak ditemukan.`,
      });
    }

    // Hapus gambar yang ada di storage (pastikan gambar ada di dalam array destinasi.image)
    if (destinasi.image && destinasi.image.length > 0) {
      destinasi.image.forEach(imagePath => {
        const filePath = path.join(__dirname, '../..', 'uploads', imagePath.split('/').pop());
        // Mengambil nama file dan menggabungkannya dengan path penyimpanan
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath); // Menghapus file gambar dari storage
        }
      });
    }

    // Hapus destinasi dari database
    await destinasi.destroy();

    res.status(200).json({
      message: 'Destinasi beserta gambar berhasil dihapus.',
    });
  } catch (error) {
    res.status(500).json({
      message: 'Gagal menghapus destinasi.',
      error: error.message,
    });
  }
};


const editDestination = async (req, res) => {
  const { id } = req.params;
  const {
    name,
    category,
    latitude,
    longitude,
    gmaps,
    shortdeskripsi,
    longdeskripsi,
    fasilitas,
  } = req.body;

  try {
    // Cari destinasi berdasarkan ID
    const destinasi = await Destination.findByPk(id);
    if (!destinasi) {
      return res.status(404).json({
        message: `Destinasi dengan ID ${id} tidak ditemukan.`,
      });
    }

    // Jika ada gambar baru yang diunggah
    let imagePaths = destinasi.image; // Gambar lama
    if (req.files && req.files.length > 0) {
      imagePaths = req.files.map(file => `/uploads/${file.filename}`);
    }

    // Update data destinasi
    destinasi.name = name || destinasi.name;
    destinasi.category = category || destinasi.category;
    destinasi.latitude = latitude || destinasi.latitude;
    destinasi.longitude = longitude || destinasi.longitude;
    destinasi.gmaps = gmaps || destinasi.gmaps;
    destinasi.shortdeskripsi = shortdeskripsi || destinasi.shortdeskripsi;
    destinasi.longdeskripsi = longdeskripsi || destinasi.longdeskripsi;
    destinasi.image = imagePaths;
    destinasi.fasilitas = fasilitas ? JSON.parse(fasilitas) : destinasi.fasilitas;

    // Simpan perubahan ke database
    await destinasi.save();

    res.status(200).json({
      message: 'Destinasi berhasil diperbarui.',
      data: destinasi,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Gagal memperbarui destinasi.',
      error: error.message,
    });
  }
};


module.exports = {
  uploadDestination,
  getAllDestionation,
  deleteDestination,
  getDestinationById,
  editDestination,
}


