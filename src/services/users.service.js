import http from 'http-common';
const prefix = '/user';

const getUsername = userId => {
  return http.get(prefix + '/getUsername', {
    params: { empId: userId },
  });
};
const updateUser = (userId, data) => {
  return http.put(prefix + '/updateUser', data, {
    params: { empId: userId },
  });
};
const getUserList = () => {
  return http.get(prefix + '/getUserList');
};

const createNewUser = data => {
  return http.post(prefix + '/createNewUser', data);
};

const deleteUser = empId => {
  return http.delete(`${prefix}/deleteUser`, {
    params: { empId: empId },
  });
};
export default {
  getUsername,
  getUserList,
  createNewUser,
  updateUser,
  deleteUser,
};
