import axios from 'axios';
const username = 'VUh4MmZDekFzeDlHd1BHVzJranpHUT09'
const password = 'NFgrWHk2bTE1UURGZ0M0WXVwOVpxQT09'
const token = Buffer.from(`${username}:${password}`, 'utf8').toString('base64')


export default axios.create({
  // baseURL: `http://undefined.ddns.net:8084/`,
  // baseURL: `https://undefined.ddns.net/mbkimport/`,
  baseURL: `http://localhost:3002/mbkimport/`,
  headers: {
    'Authorization': `Basic ${token}`,
    accessToken : localStorage.getItem("accessToken")
  }
});