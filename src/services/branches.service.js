import http from 'http-common';
const prefix = '/branch';
import authHeader from './auth-header';

const getAllBranch = () => {
  return http.get(prefix + '/getAllBranch', {
    headers: {
      'Content-type': 'application/json',
    },
  });
};
const createNewBranch = data => {
  return http.post(prefix + '/createNewBranch', data, {
    headers: {
      'Content-type': 'application/json',
    },
  });
};
const updateBranch = (brId, data) => {
  return http.put(prefix + '/updateBranch', data, {
    headers: {
      'Content-type': 'application/json',
    },
    params: { brId: brId },
  });
};
const getBranchById = brId => {
  return http.get(prefix + '/getBranchById', {
    headers: {
      'Content-type': 'application/json',
    },
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
    headers: {
      'Content-type': 'application/json',
    },
    params: { brId: brId },
  });
};
export default {
  getAllBranch,
  createNewBranch,
  getBranchById,
  updateBranch,
  createBranchAcc,
  checkExistAcc,
  updateBrAcc,
};
