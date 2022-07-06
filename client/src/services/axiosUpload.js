import axios from 'axios';
import config from './helpers';
const username = 'VUh4MmZDekFzeDlHd1BHVzJranpHUT09'
const password = 'NFgrWHk2bTE1UURGZ0M0WXVwOVpxQT09'
const token = Buffer.from(`${username}:${password}`, 'utf8').toString('base64')


// export default axios.create({
//   // baseURL: `http://undefined.ddns.net:8084/`,
//   baseURL: `https://undefined.ddns.net/mbkimport/`,
//   // baseURL: `http://localhost:3002/mbkimport/`,
//   headers: {
//     'Authorization': `Basic ${token}`,
//     accessToken : sessionStorage.getItem("accessToken")
//   }
// });

const axiosInstance = axios.create({
  // baseURL: `https://undefined.ddns.net/mbkimport/`,
  baseURL: config._baseURLImport,
  // baseURL: `https://hopeagro.co.th/mahboonkrongimport/`,
  // baseURL: `http://localhost:3002/mahboonkrongimport/`,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const tokens = token;
    const auth = tokens ? `Bearer ${tokens}` : '';
    config.headers.common['Authorization'] = auth;
    config.headers.common['accessToken'] = sessionStorage.getItem("accessToken");;
    return config;
  },
  (error) => Promise.reject(error),
);

export default axiosInstance;