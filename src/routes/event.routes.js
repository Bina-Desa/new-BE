const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/multerConfig');
const { getAllEvent, createEvent, getEventById, deleteEvent, editEvent } = require('../controllers/event.controller');


// Rute untuk upload gambar
router.get('/', getAllEvent)
router.post('/', [authenticate, upload.array('image')], createEvent);
router.get('/:id', getEventById)
router.delete('/:id', authenticate, deleteEvent)
router.put('/:id', [authenticate, upload.array('image')], editEvent)

// Rute untuk menghapus gambar
// router.delete('/delete/:id', destinationController.deleteDestination);

module.exports = router;
