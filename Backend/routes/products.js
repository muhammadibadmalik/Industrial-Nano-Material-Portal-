const express  = require('express');
const router   = express.Router();
const protect  = require('../middleware/auth');
const {
  getProducts, getProductById,
  createProduct, updateProduct, deleteProduct,
} = require('../controllers/productController');

// Public
router.get('/',    getProducts);
router.get('/:id', getProductById);

// Admin only (require JWT)
router.post('/',       protect, createProduct);
router.put('/:id',    protect, updateProduct);
router.delete('/:id', protect, deleteProduct);

module.exports = router;
