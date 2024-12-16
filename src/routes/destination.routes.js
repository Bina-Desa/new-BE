const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/multerConfig');
const { uploadDestination, getAllDestionation, deleteDestination, getDestinationById, editDestination } = require('../controllers/destination.controller')


// Rute untuk upload gambar
router.get('/', getAllDestionation)
router.post('/', [upload.array('image')], uploadDestination);
router.get('/:id', getDestinationById)
router.delete('/:id', deleteDestination)
router.put('/:id', [upload.array('image')], editDestination)

// Rute untuk menghapus gambar
// router.delete('/delete/:id', destinationController.deleteDestination);

module.exports = router;
