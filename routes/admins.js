const router = require('express').Router();
const { createAdmin, adminLogin, getAdminData } = require('../controllers/admins');
const { adminAuth } = require('../middlewares/adminAuth');

router.post('/signup', createAdmin);
router.post('/signin', adminLogin);

router.get('/me', adminAuth, getAdminData);

module.exports = router;
