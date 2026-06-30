const router = require('express').Router();
const { protect, requireRole } = require('../middleware/auth');
const { summary } = require('../controllers/reportController');

router.use(protect);
router.get('/summary', requireRole('admin', 'manager'), summary);

module.exports = router;
