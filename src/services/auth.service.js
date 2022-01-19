import http from 'http-common';
const user = JSON.parse(localStorage.getItem('user'));

const register = data => {
  return http.post('/auth/signup', {
    data,
  });
};

const login = (username, password) => {
  return http
    .post('/auth/signin', {
      username,
      password,
    })
    .then(response => {
      if (response.data.accessToken) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }

      return response.data;
    });
};

const getAllRole = () => {
  return http.get('/getAdminRoles', {
    headers: {
      'Content-type': 'application/json',
      // 'x-access-token': user.accessToken,
    },
  });
};

const getAllAdminAccounts = () => {
  return http.get('/getAdminAccounts', {
    headers: {
      'Content-type': 'application/json',
      // 'x-access-token': user.accessToken,
    },
  });
};
const removeAccount = id => {
  return http.get(`/deleteAdminAccount/${id}`, {
    headers: {
      'Content-type': 'application/json',
      // 'x-access-token': user.accessToken,
    },
  });
};
const logout = () => {
  localStorage.removeItem('user');
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('user'));
};
// eslint-disable-next-line
export default {
  register,
  login,
  logout,
  getCurrentUser,
  getAllRole,
  getAllAdminAccounts,
  removeAccount,
};
