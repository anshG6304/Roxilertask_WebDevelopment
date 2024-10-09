const axios = require('axios');

const fetchData = async () => {
  try {
    const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch data from third-party API:', error);
    throw error;
  }
};

module.exports = fetchData;
