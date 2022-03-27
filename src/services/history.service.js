import http from 'http-common';
import authHeader from './auth-header';

const listOrderDashboard = async () => {
  return await http.get('/order/listOrderDashboard', {
    headers: authHeader(),
  });
};

export default {
  listOrderDashboard,
};
