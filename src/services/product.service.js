import http from 'http-common';

const prefix = '/product';
const createProduct = data => {
  return http.post(prefix + '/createProduct', data, {
    headers: {
      'Content-type': 'application/json',
    },
  });
};

const getAllProducts = () => {
  return http.get(prefix + '/getAllProducts', {
    headers: {
      'Content-type': 'application/json',
      // 'x-access-token': user.accessToken,
    },
  });
};

const getAllProductTypes = () => {
  return http.get(prefix + '/getAllProductTypes', {
    headers: {
      'Content-type': 'application/json',
      // 'x-access-token': user.accessToken,
    },
  });
};
const createType = data => {
  return http.post(
    prefix + '/createType',
    { typeName: data },
    {
      headers: {
        'Content-type': 'application/json',
        // 'x-access-token': user.accessToken,
      },
    },
  );
};
const disableType = typeId => {
  return http.delete(prefix + '/disableType', {
    headers: {
      'Content-type': 'application/json',
      // 'x-access-token': user.accessToken,
    },
    params: { typeId: typeId },
  });
};
const getProductById = prId => {
  return http.get(prefix + '/getProductById', {
    headers: {
      'Content-type': 'application/json',
    },
    params: { prId: prId },
  });
};
const updateProduct = (prId, data) => {
  return http.put(prefix + '/updateProduct', data, {
    headers: {
      'Content-type': 'application/json',
    },
    params: { prId: prId },
  });
};
export default {
  createProduct,
  createType,
  getAllProducts,
  getAllProductTypes,
  getProductById,
  disableType,
  updateProduct,
};
