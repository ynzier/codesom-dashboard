import http from 'http-common';
const prefix = '/report';

const getDateTopSale = async date => {
  return await http.post(prefix + '/getDateTopSale', date);
};
const getDateReport = async date => {
  return await http.post(prefix + '/getDateReport', date);
};
const getChartReport = async date => {
  return await http.post(prefix + '/getChartReport', date);
};
const getProductChart = async branchId => {
  return await http.post(prefix + '/getProductChart', branchId);
};
const getIngrChart = async branchId => {
  return await http.post(prefix + '/getIngrChart', branchId);
};
const getTimeChart = async data => {
  return await http.post(prefix + '/getTimeChart', data);
};
export default {
  getDateTopSale,
  getDateReport,
  getChartReport,
  getProductChart,
  getIngrChart,
  getTimeChart,
};
