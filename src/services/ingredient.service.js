import http from 'http-common';

import authHeader from './auth-header';

const prefix = '/ingredients';
const createIngredient = data => {
  return http.post(
    prefix + '/createIngredient',
    { data: data },
    {
      headers: authHeader(),
    },
  );
};
export default {
  createIngredient,
};
