const router = require('express').Router();
const { protect, requireRole } = require('../middleware/auth');
const c = require('../controllers/workController');

router.use(protect);
router.get('/', c.listWorks);
router.post('/', requireRole('employee', 'admin'), c.createWork);
router.post('/:id/submit', c.submitWork);
router.post('/:id/inspect', requireRole('manager', 'admin'), c.inspectWork);
router.put('/:id/inspection', requireRole('manager', 'admin'), c.updateInspectionNotes);

module.exports = router;