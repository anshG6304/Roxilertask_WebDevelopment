const express = require('express');
const {
  initializeDatabase,
  listTransactions,
  getStatistics,
  getBarChart,
  getPieChart
} = require('../controllers/productController');

const router = express.Router();

// API endpoints
router.get('/initialize-db', initializeDatabase);
router.get('/transactions', listTransactions);
router.get('/statistics', getStatistics);
router.get('/bar-chart', getBarChart);
router.get('/pie-chart', getPieChart);

module.exports = router;
