import http from 'http-common';
const prefix = '/branch';
import authHeader from './auth-header';

const area = { getAllBranch: 'getAllBranch' };
const getAllBranch = async () => {
  return await http.get(prefix + '/getAllBranch', {
    headers: authHeader(),
  });
};
const getAllBranchName = () => {
  return http.get(prefix + '/getAllBranchName', {
    headers: authHeader(),
  });
};
const createNewBranch = data => {
  return http.post(prefix + '/createNewBranch', data, {
    headers: authHeader(),
  });
};
const updateBranch = (brId, data) => {
  return http.put(prefix + '/updateBranch', data, {
    headers: authHeader(),
    params: { brId: brId },
  });
};
const getBranchById = brId => {
  return http.get(prefix + '/getBranchById', {
    headers: authHeader(),
    params: { brId: brId },
  });
};
const createBranchAcc = (brId, data) => {
  return http.post(prefix + '/createBranchAcc', data, {
    headers: authHeader(),
    params: { brId: brId },
  });
};
const updateBrAcc = (brId, data) => {
  return http.put(prefix + '/updateBrAcc', data, {
    headers: authHeader(),
    params: { brId: brId },
  });
};
const checkExistAcc = brId => {
  return http.get(prefix + '/checkExistAcc', {
    headers: authHeader(),
    params: { brId: brId },
  });
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
};
