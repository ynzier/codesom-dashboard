import http from 'http-common';
import authHeader from './auth-header';

const listOrderDashboard = async () => {
  return await http.get('/order/listOrderDashboard', {
    headers: authHeader(),
  });
};
const getOrderItemsByIdDashboard = async ordId => {
  return http.get('/order/getOrderItemsByIdDashboard', {
    headers: authHeader(),
    params: { ordId: ordId },
  });
};
export default {
  listOrderDashboard,
  getOrderItemsByIdDashboard,
};
