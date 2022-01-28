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

export default { getAllBranch, createNewBranch };
