import http from 'http-common';
const user = JSON.parse(localStorage.getItem('user'));

const add = data => {
  return http.post('/product/add', data, {
    headers: {
      'Content-type': 'application/json',
      // 'x-access-token': user.accessToken,
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

const getAll = () => {
  return http.get('/product/getAll', {
    headers: {
      'Content-type': 'application/json',
      // 'x-access-token': user.accessToken,
    },
  });
};

const getProductType = () => {
  return http.get('/product/getAllProductType', {
    headers: {
      'Content-type': 'application/json',
      // 'x-access-token': user.accessToken,
    },
  });
};
const addProductType = data => {
  return http.post('/product/addProductType', data, {
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
  add,
  remove,
  getAll,
  getProductType,
  getBrand,
  addBrand,
  deleteBrand,
  getOne,
  update,
  addProductType,
  deleteProductType,
};
