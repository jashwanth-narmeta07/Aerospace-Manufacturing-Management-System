const router = require('express').Router();
const { protect, requireRole } = require('../middleware/auth');
const c = require('../controllers/inventoryController');

router.use(protect);
router.get('/', c.listInventory);
router.post('/', requireRole('admin'), c.createInventory);
router.put('/:id', requireRole('admin', 'manager'), c.updateInventory);

module.exports = router;
