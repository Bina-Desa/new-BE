const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/multerConfig');
const { getAllWarungs, createWarung, updateWarung, deleteWarung } = require('../controllers/warung.controller');
const { createProduct, getAllProduct, getProductById, deleteProduct, editProduct } = require('../controllers/product.controller');


// Rute untuk upload gambar
router.get('/warung', getAllWarungs)
router.post('/warung', createWarung)
router.put('/warung/:id', updateWarung)
router.delete('/warung/:id', deleteWarung)

router.get('/product', getAllProduct);
router.get('/product/:id', getProductById);
router.delete('/product/:id', deleteProduct);
router.post('/product', [upload.array('image')], createProduct);
router.put('/product/:id', [upload.array('image')], editProduct);

module.exports = router;