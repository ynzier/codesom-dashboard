import http from 'http-common';
import authHeader from './auth-header';

const listOrderDashboard = async () => {
  return await http.get('/order/listOrderDashboard', {
    headers: authHeader(),
  });
};
const listOrderDashboardByBranch = async branchId => {
  return await http.get('/order/listOrderDashboardByBranch', {
    params: { branchId: branchId },
  });
};
const getOrderItemsByIdDashboard = async orderId => {
  return http.get('/order/getOrderItemsByIdDashboard', {
    headers: authHeader(),
    params: { orderId: orderId },
  });
};
export default {
  listOrderDashboard,
  getOrderItemsByIdDashboard,
  listOrderDashboardByBranch,
};
