import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getTransactions = (params) => apiClient.get('/transactions', { params });
export const getStatistics = (params) => apiClient.get('/statistics', { params });
export const getBarChartData = (params) => apiClient.get('/bar-chart', { params });
