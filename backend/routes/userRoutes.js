const router = require('express').Router();
const { protect, requireRole } = require('../middleware/auth');
const c = require('../controllers/userController');

router.use(protect);
router.get('/', c.listUsers);
router.post('/', requireRole('admin'), c.createUser);
router.put('/:id', requireRole('admin'), c.updateUser);
router.delete('/:id', requireRole('admin'), c.deleteUser);

module.exports = router;
