import http from 'http-common';
const prefix = '/user';

const getUserList = () => {
  return http.get(prefix + '/getUserList', {
    headers: {
      'Content-type': 'application/json',
      // 'x-access-token': user.accessToken,
    },
  });
};

const createNewUser = data => {
  return http.post(prefix + '/createNewUser', data, {
    headers: {
      'Content-type': 'application/json',
    },
  });
};

export default { getUserList, createNewUser };
