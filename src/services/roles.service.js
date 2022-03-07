import http from 'http-common';
const prefix = '/employee';
import authHeader from './auth-header';


const getAllRoles = () => {
  return http.get(prefix + '/getAllRoles', {
    headers: authHeader(),
  });
};

export default { getAllRoles };
