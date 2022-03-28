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
const getAllProductInStorage = branchId => {
  return http.get(prefix + '/getAllProductInStorage', {
    headers: authHeader(),
    params: { branchId: branchId },
  });
};
const getAllIngrInStorage = branchId => {
  return http.get(prefix + '/getAllIngrInStorage', {
    headers: authHeader(),
    params: { branchId: branchId },
  });
};
const getAllStuffInStorage = branchId => {
  return http.get(prefix + '/getAllStuffInStorage', {
    headers: authHeader(),
    params: { branchId: branchId },
  });
};
export default {
  getAllBranchThatHaveProduct,
  getDashboardIngrStuffList,
  removeList,
  area,
  getAllStuffInStorage,
  getAllIngrInStorage,
  getAllProductInStorage,
};
