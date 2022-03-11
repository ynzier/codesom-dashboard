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
export default {
  createStuff,
};
