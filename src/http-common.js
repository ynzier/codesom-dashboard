import * as axios from 'axios';
import TokenService from 'services/token.service';

const instance = axios.create({
  // local localhost:4000
  // online api.knt-dev.online
  baseURL: 'http://api.knt-dev.online/',
  timeout: 3000,
  timeoutErrorMessage: 'การเชื่อมต่อขัดข้อง',
  headers: {
    'Content-Type': 'application/json',
  },
});
instance.interceptors.request.use(
  config => {
    const token = TokenService.getLocalAccessToken();
    if (token) {
      config.headers['x-access-token'] = token; // for Node.js Express back-end
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);
instance.interceptors.response.use(
  res => {
    return res;
  },
  async err => {
    const originalConfig = err.config;
    if (originalConfig.url !== '/auth/signin' && err.response) {
      // Access Token was expired
      if (err.response.status === 401 && !originalConfig._retry) {
        originalConfig._retry = true;
        try {
          const rs = await instance.post('/auth/refreshtoken', {
            refreshToken: TokenService.getLocalRefreshToken(),
          });
          const { accessToken, refreshToken } = rs.data;
          TokenService.updateLocalAccessToken(accessToken, refreshToken);
          return instance(originalConfig);
        } catch (_error) {
          return Promise.reject(_error);
        }
      }
    }
    return Promise.reject(err);
  },
);
export default instance;
