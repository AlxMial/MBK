import axios from 'axios';

export default axios.create({
  baseURL: `http://undefined.ddns.net:8084/`,
  headers: {
    accessToken : localStorage.getItem("accessToken")
  }
});