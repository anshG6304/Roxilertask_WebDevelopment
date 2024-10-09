import React, { useEffect, useState } from 'react';
import axios from 'axios';

const StatisticsBox = ({ selectedMonth }) => {
  const [statistics, setStatistics] = useState({
    totalSaleAmount: 0,
    totalSoldItems: 0,
    totalNotSoldItems: 0,
  });

  useEffect(() => {
    const fetchStatistics = async () => {
      const response = await axios.get(`http://localhost:3000/api/statistics`, {
        params: { month: selectedMonth },
      });
      setStatistics(response.data);
    };
    fetchStatistics();
  }, [selectedMonth]);

  return (
    <div>
      <h3>Statistics for {selectedMonth}</h3>
      <p>Total Sale Amount: {statistics.totalSaleAmount}</p>
      <p>Total Sold Items: {statistics.totalSoldItems}</p>
      <p>Total Not Sold Items: {statistics.totalNotSoldItems}</p>
    </div>
  );
};

export default StatisticsBox;
