import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';

const BarChart = ({ selectedMonth }) => {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    const fetchBarChartData = async () => {
      const response = await axios.get(`http://localhost:3000/api/bar-chart`, {
        params: { month: selectedMonth },
      });
      const { priceRanges } = response.data;
      
      setChartData({
        labels: Object.keys(priceRanges),
        datasets: [
          {
            label: 'Number of Items',
            data: Object.values(priceRanges),
            backgroundColor: 'rgba(75,192,192,0.6)',
          },
        ],
      });
    };
    fetchBarChartData();
  }, [selectedMonth]);

  return <Bar data={chartData} />;
};

export default BarChart;
