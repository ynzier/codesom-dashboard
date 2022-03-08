import http from 'http-common';

import authHeader from './auth-header';

const prefix = '/storage';

const getAllBranchThatHaveProduct = productId => {
  return http.get(prefix + '/getAllBranchThatHaveProduct', {
    headers: authHeader(),
    params: { productId: productId },
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
  removeList,
};
