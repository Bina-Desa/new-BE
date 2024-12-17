const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/multerConfig');
const { getAllWarungs, createWarung, updateWarung, deleteWarung } = require('../controllers/warung.controller');
const { createProduct, getAllProduct, getProductById, deleteProduct, editProduct } = require('../controllers/product.controller');


// Rute untuk upload gambar
router.get('/warung', getAllWarungs)
router.post('/warung', authenticate, createWarung)
router.put('/warung/:id', authenticate, updateWarung)
router.delete('/warung/:id', authenticate, deleteWarung)

router.get('/product', getAllProduct);
router.get('/product/:id', getProductById);
router.delete('/product/:id', authenticate, deleteProduct);
router.post('/product', [authenticate, upload.array('image')], createProduct);
router.put('/product/:id', [authenticate, upload.array('image')], editProduct);

module.exports = router;