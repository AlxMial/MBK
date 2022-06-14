const axios = require("axios");
const username = 'VUh4MmZDekFzeDlHd1BHVzJranpHUT09'
const password = 'NFgrWHk2bTE1UURGZ0M0WXVwOVpxQT09'
const token = Buffer.from(`${username}:${password}`, 'utf8').toString('base64')

const axiosInstance = axios.create({
  baseURL: `http://localhost:3002/mbkimport/`,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const tokens = token;
    const auth = tokens ? `Bearer ${tokens}` : '';
    config.headers.common['Authorization'] = auth;
    return config;
  },
  (error) => Promise.reject(error),
);

module.exports = axiosInstance;