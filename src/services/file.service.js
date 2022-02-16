import http from 'http-common';
const prefix = '/file';
import authHeader from './auth-header';

const upload = base64TextString => {
  return http.post(
    prefix + '/upload',
    { image: base64TextString },
    {
      headers: {
        'Content-type': 'application/json',
      },
    },
  );
};

export default {
  upload,
};
