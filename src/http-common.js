import axios from 'axios';

export default axios.create({
  baseURL: 'http://knt-dev.online:8082/api/admin',
});
