import http from 'http-common';

const createProduct = data => {
  return http.post('/product/createProduct', data, {
    headers: {
      'Content-type': 'application/json',
    },
  });
};

const remove = id => {
  return http.delete('/product/deleteProduct/' + id, {
    headers: {
      'Content-type': 'application/json',
      // 'x-access-token': user.accessToken,
    },
  });
};

const getAllProducts = () => {
  return http.get('/product/getAllProducts', {
    headers: {
      'Content-type': 'application/json',
      // 'x-access-token': user.accessToken,
    },
  });
};

const getAllProductTypes = () => {
  return http.get('/product/getAllProductTypes', {
    headers: {
      'Content-type': 'application/json',
      // 'x-access-token': user.accessToken,
    },
  });
};
const createType = data => {
  return http.post('/product/createType', data, {
    headers: {
      'Content-type': 'application/json',
      // 'x-access-token': user.accessToken,
    },
  });
};
const deleteProductType = id => {
  return http.delete('/product/deleteProductType/' + id, {
    headers: {
      'Content-type': 'application/json',
      // 'x-access-token': user.accessToken,
    },
  });
};
const addBrand = data => {
  return http.post('/product/addBrand', data, {
    headers: {
      'Content-type': 'application/json',
      // 'x-access-token': user.accessToken,
    },
  });
};
const getBrand = () => {
  return http.get('/product/getAllBrands', {
    headers: {
      'Content-type': 'application/json',
      // 'x-access-token': user.accessToken,
    },
  });
};
const deleteBrand = id => {
  return http.delete('/product/deleteBrand/' + id, {
    headers: {
      'Content-type': 'application/json',
      // 'x-access-token': user.accessToken,
    },
  });
};

const getOne = id => {
  return http.get(`/product/getOne/${id}`, {
    headers: {
      'Content-type': 'application/json',

      // 'x-access-token': user.accessToken,
    },
  });
};
const update = (id, data) => {
  return http.put(`/product/update/${id}`, data);
};
// eslint-disable-next-line
export default {
  createProduct,
  remove,
  getAllProducts,
  getAllProductTypes,
  getBrand,
  addBrand,
  deleteBrand,
  getOne,
  update,
  createType,
  deleteProductType,
};
