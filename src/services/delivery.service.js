import http from 'http-common';
const prefix = '/lalamove';
import authHeader from './auth-header';

const getDeliveryList = async () => {
  return await http.get(prefix + '/getDeliveryList', {
    headers: authHeader(),
  });
};

const getDeliveryListBranch = async id => {
  return await http.get(prefix + '/getDeliveryList/' + id, {
    headers: authHeader(),
  });
};
export default {
  getDeliveryList,
  getDeliveryListBranch,
};
