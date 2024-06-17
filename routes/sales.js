const router = require('express').Router();
const {
  getAllSales,
  updateSale,
  createSale,
  deleteSale,
} = require('../controllers/sales');
const { adminAuth } = require('../middlewares/adminAuth');

router.get('/', getAllSales);
router.post('/', adminAuth, createSale);
router.patch('/:saleId', adminAuth, updateSale);
router.delete(':saleId', adminAuth, deleteSale);

module.exports = router;
