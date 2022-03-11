import http from 'http-common';

const area = { signinDashboard: 'signinDashboard' };
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
    })
    .catch(error => {
      throw error;
    });
};

const logoutDashboard = () => {
  localStorage.removeItem('user');
  window.location.reload();
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('user'));
};

export default {
  signinDashboard,
  logoutDashboard,
  getCurrentUser,
  area,
};
