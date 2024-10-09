const Product = require('../models/Product');
const axios = require('axios');

// Initialize DB with seed data
exports.initializeDatabase = async (req, res) => {
  try {
    const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
    const products = response.data;
    
    await Product.insertMany(products); // Seed data into MongoDB
    res.status(200).json({ message: 'Database initialized with seed data' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to initialize database' });
  }
};

// List transactions with search and pagination
const listTransactions = async (req, res) => {
    try {
      const { search = '', page = 1, perPage = 10, month } = req.query;
      const regex = new RegExp(search, 'i');  // 'i' makes it case-insensitive
  
      // Define the base query object
      let query = {};
  
      // If search text is present, add search conditions
      if (search) {
        query = {
          $or: [
            { title: { $regex: regex } },
            { description: { $regex: regex } },
            { price: { $regex: regex } }
          ]
        };
      }
  
      // Filter by month if provided
    //   if (month) {
    //     const monthIndex = new Date(`${month} 1, 2023`).getMonth(); // Get month index from 0 to 11
    //     query.dateOfSale = {
    //       $gte: new Date(2023, monthIndex, 1),
    //       $lt: new Date(2023, monthIndex + 1, 1) // Next month start
    //     };
    //   }
      if (month) {
        const monthStart = new Date(`${month} 1, 2023`);
        const monthEnd = new Date(`${month} 31, 2023`);
        
        // Debug logging for date values
        console.log('Start of month:', monthStart);
        console.log('End of month:', monthEnd);
      
        query.dateOfSale = {
          $gte: monthStart,
          $lt: monthEnd
        };
      }
      if (!month) {
        console.log('Month is not provided, applying default date filter');
        // Apply default month or return an error response
        res.status(400).json({ error: 'Month is required' });
        return;
      }
      
  
      // Pagination: Skip and Limit
      const transactions = await Product.find(query)
        .skip((page - 1) * perPage)  // Skip based on page number
        .limit(Number(perPage));      // Limit results per page
  
      // Get total number of matching records for pagination metadata
      const totalRecords = await Product.countDocuments(query);
  
      res.status(200).json({
        page,
        perPage,
        totalRecords,
        transactions
      });
    } catch (error) {
        console.error(error);  // Log the error in your terminal or console
        res.status(500).json({ error: 'Failed to fetch transactions', message: error.message });
            }
  };
  
// API for statistics
exports.getStatistics = async (req, res) => {
  const { month } = req.query;
  const monthStart = new Date(`${month} 1`);
  const monthEnd = new Date(`${month} 31`);

  try {
    const totalSold = await Product.countDocuments({ sold: true, dateOfSale: { $gte: monthStart, $lt: monthEnd } });
    const totalNotSold = await Product.countDocuments({ sold: false, dateOfSale: { $gte: monthStart, $lt: monthEnd } });
    const totalSaleAmount = await Product.aggregate([
      { $match: { sold: true, dateOfSale: { $gte: monthStart, $lt: monthEnd } } },
      { $group: { _id: null, totalAmount: { $sum: "$price" } } }
    ]);

    res.status(200).json({
      totalSaleAmount: totalSaleAmount[0]?.totalAmount || 0,
      totalSoldItems: totalSold,
      totalNotSoldItems: totalNotSold
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
};

// API for bar chart (price range distribution)
exports.getBarChart = async (req, res) => {
  const { month } = req.query;
  const monthStart = new Date(`${month} 1`);
  const monthEnd = new Date(`${month} 31`);

  const priceRanges = [
    { range: '0-100', min: 0, max: 100 },
    { range: '101-200', min: 101, max: 200 },
    { range: '201-300', min: 201, max: 300 },
    { range: '301-400', min: 301, max: 400 },
    { range: '401-500', min: 401, max: 500 },
    { range: '501-600', min: 501, max: 600 },
    { range: '601-700', min: 601, max: 700 },
    { range: '701-800', min: 701, max: 800 },
    { range: '801-900', min: 801, max: 900 },
    { range: '901-above', min: 901, max: Infinity }
  ];

  try {
    const result = await Promise.all(priceRanges.map(async range => {
      const count = await Product.countDocuments({
        price: { $gte: range.min, $lt: range.max },
        dateOfSale: { $gte: monthStart, $lt: monthEnd }
      });
      return { range: range.range, count };
    }));

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch bar chart data' });
  }
};

// API for pie chart (category distribution)
exports.getPieChart = async (req, res) => {
  const { month } = req.query;
  const monthStart = new Date(`${month} 1`);
  const monthEnd = new Date(`${month} 31`);

  try {
    const result = await Product.aggregate([
      { $match: { dateOfSale: { $gte: monthStart, $lt: monthEnd } } },
      { $group: { _id: "$category", count: { $sum: 1 } } }
    ]);

    const formattedResult = result.map(item => ({ category: item._id, count: item.count }));
    res.status(200).json(formattedResult);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch pie chart data' });
  }
};
