import axios from 'axios';

export default axios.create({
  baseURL: `http://localhost:3001/`,
  headers: {
    "Content-type": "multipart/form-data",
    accessToken : localStorage.getItem("accessToken")
  }
});