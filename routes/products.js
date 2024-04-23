const router = require('express').Router();
const {
  getAllProducts,
  createProduct,
  updateProductData,
  deleteProduct,
} = require('../controllers/products');
const { adminAuth, checkAdmin } = require('../middlewares/adminAuth');

router.get('/', getAllProducts);
router.post('/', adminAuth, checkAdmin, createProduct);

router.patch('/:productId', adminAuth, checkAdmin, updateProductData);
router.delete('/:productId', adminAuth, checkAdmin, deleteProduct);

module.exports = router;
