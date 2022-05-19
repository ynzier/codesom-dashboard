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

const ingredientForRecipe = () => {
  return http.get(prefix + '/ingredientForRecipe', {
    headers: authHeader(),
  });
};
const getIngredientById = id => {
  return http.get(prefix + '/getIngredientById', {
    headers: authHeader(),
    params: { ingrId: id },
  });
};
const updateIngredient = (id, data) => {
  return http.put(
    prefix + '/updateIngredient',
    { data: data },
    {
      headers: authHeader(),
      params: { ingrId: id },
    },
  );
};
export default {
  createIngredient,
  ingredientForRecipe,
  getIngredientById,
  updateIngredient,
};
