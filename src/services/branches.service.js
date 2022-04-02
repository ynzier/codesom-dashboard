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
const updateBranch = (brId, data) => {
  return http.put(prefix + '/updateBranch', data, {
    params: { brId: brId },
  });
};
const getBranchById = brId => {
  return http.get(prefix + '/getBranchById', {
    params: { brId: brId },
  });
};
const createBranchAcc = (brId, data) => {
  return http.post(prefix + '/createBranchAcc', data, {
    params: { brId: brId },
  });
};
const updateBrAcc = (brId, data) => {
  return http.put(prefix + '/updateBrAcc', data, {
    params: { brId: brId },
  });
};
const checkExistAcc = brId => {
  return http.get(prefix + '/checkExistAcc', {
    params: { brId: brId },
  });
};
const getBranchByManager = () => {
  return http.get(prefix + '/getBranchByManager');
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
};
