import http from 'http-common';

import authHeader from './auth-header';

const prefix = '/stuffs';
const createStuff = data => {
  return http.post(
    prefix + '/createStuff',
    { data: data },
    {
      headers: authHeader(),
    },
  );
};
const getStuffById = id => {
  return http.get(prefix + '/getStuffById', {
    headers: authHeader(),
    params: { stuffId: id },
  });
};
const updateStuff = (id, data) => {
  return http.put(
    prefix + '/updateStuff',
    { data: data },
    {
      headers: authHeader(),
      params: { stuffId: id },
    },
  );
};
export default {
  createStuff,
  getStuffById,
  updateStuff,
};
