import http from 'http-common';
const prefix = '/requisition';
import authHeader from './auth-header';

const area = { listAllReq: 'listAllReq', getReqDetailById: 'getReqDetailById' };

const listAllReq = async () => {
  return await http.get(prefix + '/listAllReq', {
    headers: authHeader(),
  });
};

const getItemMakeRequest = async branchId => {
  return await http.get('/storage' + '/getItemMakeRequest', {
    headers: authHeader(),
    params: { branchId: branchId },
  });
};
const getReqDetailById = async id => {
  return await http.get(prefix + '/getReqDetailById', {
    headers: authHeader(),
    params: { id: id },
  });
};
const getReqItemsById = async id => {
  return await http.get(prefix + '/getReqItemsById', {
    headers: authHeader(),
    params: { id: id },
  });
};
const createRequisit = async (data, branchId) => {
  return http.post(prefix + '/createReqApp', data, {
    headers: authHeader(),
    params: { branchId: branchId },
  });
};

const updateReqStatus = async (data, id) => {
  return http.put(
    prefix + '/updateReqStatus',
    { status: data },
    {
      headers: authHeader(),
      params: { id: id },
    },
  );
};

export default {
  listAllReq,
  getItemMakeRequest,
  createRequisit,
  getReqDetailById,
  getReqItemsById,
  updateReqStatus,
  area,
};
