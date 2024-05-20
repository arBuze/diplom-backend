const router = require('express').Router();
const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../src-images/product_images'));
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
  upgradeProductRating,
  deleteProduct,
  fileTake,
  deleteImages,
} = require('../controllers/products');
const { adminAuth, checkAdmin } = require('../middlewares/adminAuth');
const { auth } = require('../middlewares/auth');
const { validateCreateProduct } = require('../middlewares/validate');

router.get('/', getAllProducts);
router.post('/', /* adminAuth, checkAdmin, */validateCreateProduct, createProduct);

router.patch('/:productId', adminAuth, checkAdmin, updateProductData);
router.delete('/:productId', adminAuth, checkAdmin, deleteProduct);
router.patch('/:productId/rating', auth, upgradeProductRating);

router.post('/images', upload.array('images'), fileTake);
router.delete('/images', deleteImages);

module.exports = router;
