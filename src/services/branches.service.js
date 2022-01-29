import http from 'http-common';
const user = JSON.parse(localStorage.getItem('user'));
const prefix = '/branch';

const getAllBranch = () => {
  return http.get(prefix + '/getAllBranch', {
    headers: {
      'Content-type': 'application/json',
      // 'x-access-token': user.accessToken,
    },
  });
};
const createNewBranch = data => {
  return http.post(prefix + '/createNewBranch', data, {
    headers: {
      'Content-type': 'application/json',
      // 'x-access-token': user.accessToken,
    },
  });
};
const getBranchById = brId => {
  return http.get(prefix + '/getBranchById', {
    headers: {
      'Content-type': 'application/json',
      // 'x-access-token': user.accessToken,
    },
    params: { brId: brId },
  });
};
export default { getAllBranch, createNewBranch, getBranchById };
