const { Product, Warung } = require('../models');
const fs = require('fs');
const path = require('path');
const { updateWarung } = require('./warung.controller');

const getAllProduct = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query; // Default page = 1 dan limit = 10
    const offset = (page - 1) * limit; // Hitung offset berdasarkan halaman

    const products = await Product.findAndCountAll({
      limit: parseInt(limit), // Batas jumlah data per halaman
      offset: parseInt(offset), // Offset data untuk pagination
      include: [{ model: Warung, attributes: ['name', 'address'] }],
    });

    // Format hasil dengan metadata pagination
    res.status(200).json({
      totalItems: products.count,
      totalPages: Math.ceil(products.count / limit),
      currentPage: parseInt(page),
      items: products.rows,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, price, description, warungId } = req.body;

    // Check if Warung exists
    const warung = await Warung.findByPk(warungId);
    if (!warung) {
      return res.status(404).json({ message: 'Warung not found' });
    }

    // Process uploaded images
    const imagePaths = req.files.map((file) => `/uploads/${file.filename}`); // Assume `multer` saves filenames

    // Create Product
    const product = await Product.create({
      name,
      price,
      description,
      warungId,
      image: imagePaths, // Store array of image filenames
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    // Cari product berdasarkan ID
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({
        message: `product dengan ID ${id} tidak ditemukan.`,
      });
    }

    // Hapus gambar yang ada di storage (pastikan gambar ada di dalam array product.image)
    if (Array.isArray(product.image) && product.image.length > 0) {
      product.image.forEach((imagePath) => {
        const filePath = path.join(__dirname, '../..', 'uploads', imagePath.split('/').pop());
        // Mengambil nama file dan menggabungkannya dengan path penyimpanan
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath); // Menghapus file gambar dari storage
        }
      });
    }

    // Hapus product dari database
    await product.destroy();

    res.status(200).json({
      message: `product dengan ID ${id} berhasil dihapus.`,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Terjadi kesalahan pada server.',
      error: error.message,
    });
  }
};

const editProduct = async (req, res) => {
  const { id } = req.params;
  const { name, price, description, warungId } = req.body;

  try {
    // Cari produk berdasarkan ID
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({
        message: `Produk dengan ID ${id} tidak ditemukan.`,
      });
    }

    // Jika ada gambar baru yang diunggah
    let imagePaths = product.image; // Gambar lama
    if (req.files && req.files.length > 0) {
      imagePaths = req.files.map((file) => `/uploads/${file.filename}`);
    }

    // Update data produk
    product.name = name || product.name;
    product.price = price || product.price;
    product.description = description || product.description;
    product.warungId = warungId || product.warungId;
    product.image = imagePaths;

    // Jika ada warungId, pastikan warungnya ada
    if (warungId) {
      const warung = await Warung.findByPk(warungId);
      if (!warung) {
        return res.status(404).json({
          message: `Warung dengan ID ${warungId} tidak ditemukan.`,
        });
      }
    }

    // Simpan perubahan ke database
    await product.save();

    res.status(200).json({
      message: 'Produk berhasil diperbarui.',
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Gagal memperbarui produk.',
      error: error.message,
    });
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params; // ID produk yang akan diambil

    // Find product by ID, include the related Warung model
    const product = await Product.findByPk(id, {
      include: [{ model: Warung, attributes: ['name', 'address'] }],
    });

    // If product not found
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports = {
  getAllProduct,
  createProduct,
  editProduct,
  deleteProduct,
  getProductById,
};
