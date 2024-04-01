const router = require('express').Router();
const {
  getAllProducts,
  createProduct,
  updateProductData,
  deleteProduct,
} = require('../controllers/products');

router.get('/', getAllProducts);
router.post('/', createProduct);

router.patch('/:productId', updateProductData);
router.delete('/:productId', deleteProduct);

module.exports = router;
