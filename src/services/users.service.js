import http from 'http-common';
const prefix = '/user';
import authHeader from './auth-header';

const getUserList = () => {
  return http.get(prefix + '/getUserList', {
    headers: authHeader(),
  });
};

const createNewUser = data => {
  return http.post(prefix + '/createNewUser', data, {
    headers: authHeader(),
  });
};

export default { getUserList, createNewUser };
