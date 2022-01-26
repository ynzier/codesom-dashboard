import http from 'http-common';
import authHeader from './auth-header';

const prefix = '/dashboard';

const getAdminContent = () => {
  return http.get(prefix + '/admin', { headers: authHeader() });
};

const getManagerContent = () => {
  return http.get(prefix + '/manager', { headers: authHeader() });
};
export default { getAdminContent, getManagerContent };
