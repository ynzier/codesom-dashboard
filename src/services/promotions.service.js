import http from 'http-common';
const prefix = '/promotion';
import authHeader from './auth-header';

const getAllPromotion = async () => {
  return await http.get(prefix + '/getAllPromotion', {
    headers: authHeader(),
  });
};

const createPromotion = async data => {
  return http.post(prefix + '/createPromotion', data, {
    headers: authHeader(),
  });
};

export default {
  getAllPromotion,
  createPromotion,
};
