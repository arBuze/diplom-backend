const router = require('express').Router();
const path = require('path');
const multer = require('multer');
const { auth } = require('../middlewares/auth');
const { adminAuth, checkAdmin } = require('../middlewares/adminAuth');
const { validateCreateApp } = require('../middlewares/validate');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads/temp'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = '_' + Date.now() + '_' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + uniqueSuffix);
  },
});
const upload = multer({ storage });

const {
  createApplication,
  getAllApplications,
  getUserApplications,
  changeStatus,
  fileTake,
  deleteImages,
} = require('../controllers/repairs');

router.post('/', auth, validateCreateApp, createApplication);
router.get('/', adminAuth, checkAdmin, getAllApplications);
router.get('/me', auth, getUserApplications);
router.patch('/:repairId', adminAuth, changeStatus);

router.post('/images', upload.array('images'), fileTake);
router.delete('/images', deleteImages);

module.exports = router;
