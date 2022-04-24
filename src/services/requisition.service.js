import http from 'http-common';
const prefix = '/requisition';

const area = { listAllReq: 'listAllReq', getReqDetailById: 'getReqDetailById' };

const listAllReq = async () => {
  return await http.get(prefix + '/listAllReq');
};

const getItemMakeRequest = async branchId => {
  return await http.get('/storage' + '/getItemMakeRequest', {
    params: { branchId: branchId },
  });
};
const getReqDetailById = async id => {
  return await http.get(prefix + '/getReqDetailById', {
    params: { id: id },
  });
};
const getReqItemsById = async id => {
  return await http.get(prefix + '/getReqItemsById', {
    params: { id: id },
  });
};
const listAllReqByBranch = async id => {
  return await http.get(prefix + '/listAllReqByBranch', {
    params: { branchId: id },
  });
};
const createRequisit = async (data, branchId) => {
  return http.post(prefix + '/createReqApp', data, {
    params: { branchId: branchId },
  });
};

const updateReqStatus = async (data, id) => {
  return http.put(
    prefix + '/updateReqStatus',
    { status: data },
    {
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
  listAllReqByBranch,
};
