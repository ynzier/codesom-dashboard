import http from 'http-common';
const user = JSON.parse(localStorage.getItem('user'));

const signinDashboard = (userName, password) => {
  return http
    .post('/auth/signin', {
      userName,
      password,
    })
    .then(response => {
      if (response.data.accessToken) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }

      return response.data;
    });
};

const logoutDashboard = () => {
  localStorage.removeItem('user');
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('user'));
};

export default {
  signinDashboard,
  logoutDashboard,
  getCurrentUser,
};
