import http from 'http-common';
import authHeader from './auth-header';
const prefix = '/report';

const getDateTopSale = async date => {
  return await http.post(prefix + '/getDateTopSale', date, {
    headers: authHeader(),
  });
};
const getDateReport = async date => {
  return await http.post(prefix + '/getDateReport', date, {
    headers: authHeader(),
  });
};
export default {
  getDateTopSale,
  getDateReport,
};
