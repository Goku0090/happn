const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', eventController.getNearbyEvents);
router.get('/my-events', authMiddleware, eventController.getMyEvents);
router.post('/', authMiddleware, eventController.createEvent);
router.post('/:id/join', authMiddleware, eventController.joinEvent);

// Chat & Management
router.get('/:id/messages', eventController.getEventMessages);
router.get('/:id/participants', authMiddleware, eventController.getParticipants);
router.patch('/:id/participants/:userId', authMiddleware, eventController.updateParticipantStatus);

module.exports = router;
