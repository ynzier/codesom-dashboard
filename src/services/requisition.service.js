import http from 'http-common';
const prefix = '/requisition';
import authHeader from './auth-header';
const getItemMakeRequest = async branchId => {
  return await http.get('/storage' + '/getItemMakeRequest', {
    headers: authHeader(),
    params: { branchId: branchId },
  });
};

export default {
  getItemMakeRequest,
};
