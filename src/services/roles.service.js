import http from 'http-common';
const prefix = '/employee';

const getAllRoles = () => {
  return http.get(prefix + '/getAllRoles', {
    headers: {
      'Content-type': 'application/json',
    },
  });
};

export default { getAllRoles };
