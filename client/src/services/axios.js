import axios from 'axios';

export default axios.create({
  baseURL: `http://undefined.ddns.net:8083/`,
  headers: {
    "Content-type": "application/json",
    accessToken : localStorage.getItem("accessToken")
  }
});