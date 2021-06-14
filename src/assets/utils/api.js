import axios from 'axios';
import cookie from 'js-cookie';
import createAuthRefreshInterceptor from 'axios-auth-refresh';
import { config } from './constants';

const baseURL = config.url.API_URL;

const instance = axios.create({
  baseURL,
  headers: {
    common: {
      Authorization: cookie.get('access_token'),
    },
  },
});

const refreshAuthLogic = async failedRequest => {
  const res = await axios.get('/api/refresh', {
    baseURL,
    headers: {
      Authorization: cookie.get('refresh_token'),
    },
  });
  cookie.set('access_token', res.data.access_token);
  cookie.set('refresh_token', res.data.refresh_token);
  instance.defaults.headers.common.Authorization = res.data.access_token;
  failedRequest.response.config.headers.Authorization = res.data.access_token;
};

createAuthRefreshInterceptor(instance, refreshAuthLogic);

export default instance;
