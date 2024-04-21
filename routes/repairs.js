const router = require('express').Router();
const path = require('path');
const multer = require('multer');
const { auth } = require('../middlewares/auth');

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
  fileTake,
  deleteImages,
} = require('../controllers/repairs');

router.post('/', auth, createApplication);
router.get('/', getAllApplications);
router.get('/me', getUserApplications);

router.post('/images', upload.array('images', 10), fileTake);
router.delete('/images', deleteImages);

module.exports = router;
