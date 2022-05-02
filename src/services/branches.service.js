import http from 'http-common';
const prefix = '/branch';

const area = { getAllBranch: 'getAllBranch' };
const getAllBranch = async () => {
  return await http.get(prefix + '/getAllBranch');
};
const getAllBranchName = () => {
  return http.get(prefix + '/getAllBranchName');
};
const createNewBranch = data => {
  return http.post(prefix + '/createNewBranch', data);
};
const updateBranch = (branchId, data) => {
  return http.put(prefix + '/updateBranch', data, {
    params: { branchId: branchId },
  });
};
const getBranchById = branchId => {
  return http.get(prefix + '/getBranchById', {
    params: { branchId: branchId },
  });
};
const createBranchAcc = (branchId, data) => {
  return http.post(prefix + '/createBranchAcc', data, {
    params: { branchId: branchId },
  });
};
const updateBrAcc = (branchId, data) => {
  return http.put(prefix + '/updateBrAcc', data, {
    params: { branchId: branchId },
  });
};
const checkExistAcc = branchId => {
  return http.get(prefix + '/checkExistAcc', {
    params: { branchId: branchId },
  });
};
const getBranchByManager = () => {
  return http.get(prefix + '/getBranchByManager');
};
const deleteBranch = async branchId => {
  return await http.delete(prefix + '/deleteBranch/' + branchId);
};

export default {
  getAllBranch,
  getAllBranchName,
  createNewBranch,
  getBranchById,
  updateBranch,
  createBranchAcc,
  checkExistAcc,
  updateBrAcc,
  area,
  getBranchByManager,
  deleteBranch,
};
