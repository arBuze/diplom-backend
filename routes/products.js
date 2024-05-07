const router = require('express').Router();
const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../product-images'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = '_' + Date.now() + '_' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + uniqueSuffix);
  },
});
const upload = multer({ storage });

const {
  getAllProducts,
  createProduct,
  updateProductData,
  deleteProduct,
  fileTake,
  deleteImages,
} = require('../controllers/products');
const { adminAuth, checkAdmin } = require('../middlewares/adminAuth');

router.get('/', getAllProducts);
router.post('/', adminAuth, checkAdmin, createProduct);

router.patch('/:productId', adminAuth, checkAdmin, updateProductData);
router.delete('/:productId', adminAuth, checkAdmin, deleteProduct);

router.post('/images', upload.array('images'), fileTake);
router.delete('/images', deleteImages);

module.exports = router;
