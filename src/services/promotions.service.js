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
const updatePromotion = async (promoId, data) => {
  return http.put(prefix + '/updatePromotion', data, {
    headers: authHeader(),
    params: { promoId: promoId },
  });
};

const getPromotionById = async promoId => {
  return await http.get(prefix + '/getPromotionById', {
    headers: authHeader(),
    params: { promoId: promoId },
  });
};
export default {
  getAllPromotion,
  createPromotion,
  getPromotionById,
  updatePromotion,
};
