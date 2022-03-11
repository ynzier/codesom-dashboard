import http from 'http-common';

import authHeader from './auth-header';

const prefix = '/storage';

const area = { getDashboardIngrStuffList: 'getDashboardIngrStuffList' };
const getAllBranchThatHaveProduct = productId => {
  return http.get(prefix + '/getAllBranchThatHaveProduct', {
    headers: authHeader(),
    params: { productId: productId },
  });
};
const getDashboardIngrStuffList = () => {
  return http.get(prefix + '/getDashboardIngrStuffList', {
    headers: authHeader(),
  });
};
const removeList = (productId, branchId) => {
  return http.delete(prefix + '/removeList', {
    headers: authHeader(),
    params: { productId: productId, branchId: branchId },
  });
};
export default {
  getAllBranchThatHaveProduct,
  getDashboardIngrStuffList,
  removeList,
  area,
};
