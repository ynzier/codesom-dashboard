import http from 'http-common';

import authHeader from './auth-header';

const prefix = '/product';
const area = { productList: 'productList' };
const createProduct = data => {
  return http.post(prefix + '/createProduct', data, {
    headers: authHeader(),
  });
};

const createProductWithRecipe = data => {
  return http.post(prefix + '/createProductWithRecipe', data, {
    headers: authHeader(),
  });
};

const getAllProducts = () => {
  return http.get(prefix + '/getAllProducts', {
    headers: authHeader(),
  });
};
const getProductCreatePromo = () => {
  return http.get(prefix + '/getProductCreatePromo', {
    headers: authHeader(),
  });
};

const getAllProductTypes = () => {
  return http.get(prefix + '/getAllProductTypes', {
    headers: authHeader(),
  });
};
const createType = data => {
  return http.post(
    prefix + '/createType',
    { typeName: data },
    {
      headers: authHeader(),
    },
  );
};
const disableType = typeId => {
  return http.delete(prefix + '/disableType', {
    headers: authHeader(),
    params: { typeId: typeId },
  });
};
const getProductById = prId => {
  return http.get(prefix + '/getProductById', {
    headers: authHeader(),
    params: { prId: prId },
  });
};
const getRecipeById = productId => {
  return http.get(prefix + '/getRecipeById', {
    headers: authHeader(),
    params: { productId: productId },
  });
};
const updateProduct = (prId, data) => {
  return http.put(prefix + '/updateProduct', data, {
    headers: authHeader(),
    params: { prId: prId },
  });
};
const updateRecipe = (recipeId, data) => {
  return http.put(prefix + '/updateRecipe', data, {
    headers: authHeader(),
    params: { recipeId: recipeId },
  });
};
const getAllPairByProductId = productId => {
  return http.get(prefix + '/getAllPairByProductId', {
    headers: authHeader(),
    params: { productId: productId },
  });
};
const updatePairProductBranch = (productId, data) => {
  return http.put(
    prefix + '/pairProductBranch',
    { branchArray: data },
    {
      headers: authHeader(),
      params: { productId: productId },
    },
  );
};
export default {
  createProduct,
  createType,
  getAllProducts,
  getAllProductTypes,
  getProductById,
  disableType,
  updateProduct,
  getAllPairByProductId,
  getRecipeById,
  updatePairProductBranch,
  createProductWithRecipe,
  updateRecipe,
  area,
  getProductCreatePromo,
};
