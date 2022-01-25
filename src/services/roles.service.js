import http from 'http-common';
const user = JSON.parse(localStorage.getItem('user'));
const prefix = '/employee';

const getAllRoles = () => {
  return http.get(prefix + '/getAllRoles', {
    headers: {
      'Content-type': 'application/json',
      // 'x-access-token': user.accessToken,
    },
  });
};

export default { getAllRoles};
