import http from 'http-common';
const prefix = '/requisition';
import authHeader from './auth-header';
const getItemMakeRequest = async branchId => {
  return await http.get('/storage' + '/getItemMakeRequest', {
    headers: authHeader(),
    params: { branchId: branchId },
  });
};
const createRequisit = async (data, branchId) => {
  return http.post(prefix + '/createReqApp', data, {
    headers: authHeader(),
    params: { branchId: branchId },
  });
};

export default {
  getItemMakeRequest,
  createRequisit,
};
