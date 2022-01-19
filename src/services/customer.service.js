import http from 'http-common';
const user = JSON.parse(localStorage.getItem('user'));

const getAllCustomer = () => {
  return http.get('/getAllCustomer', {
    headers: {
      'Content-type': 'application/json',
      // 'x-access-token': user.accessToken,
    },
  });
};
const removeCustomer = id => {
  return http.get(`/deleteCustomer/${id}`, {
    headers: {
      'Content-type': 'application/json',
      // 'x-access-token': user.accessToken,
    },
  });
};
const getTransaction = id => {
  return http.get('/getTransaction/' + id, {
    headers: {
      'Content-type': 'application/json',
    },
  });
};
const getAllReceipts = () => {
  return http.get(`/getAllReceipts`, {
    headers: {
      'Content-type': 'application/json',
    },
  });
};
const updateReceipt = (id, data) => {
  return http.put(`/receipt/update/${id}/${data}`);
};
// eslint-disable-next-line
export default {
  getAllCustomer,
  removeCustomer,
  getTransaction,
  getAllReceipts,
  updateReceipt,
};
