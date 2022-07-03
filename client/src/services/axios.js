import axios from "axios";
import config from "@services/helpers";
const username = "VUh4MmZDekFzeDlHd1BHVzJranpHUT09";
const password = "NFgrWHk2bTE1UURGZ0M0WXVwOVpxQT09";
const token = Buffer.from(`${username}:${password}`, "utf8").toString("base64");

const axiosInstance = axios.create({
  // baseURL: `https://undefined.ddns.net/mbkserver/`,
  baseURL: `https://undefined.ddns.net/mahboonkrongserver/`,
  // baseURL: `https://hopeagro.co.th/mahboonkrongserver/`,
  // baseURL: `http://localhost:3001/mahboonkrongserver/`,
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

/* otp */
const headconfig = {
  "Content-Type": "application/json",
  api_key: config.api_key,
  secret_key: config.secret_key,
};
const Otp = (isSender, data, callblack) => {
  var config = {
    method: "post",
    url: isSender
      ? config.otpsend
      : config.otpvalidate,
    headers: headconfig,
    data: data,
  };

  axios(config)
    .then(function (res) {
      callblack(res.data);
    })
    .catch(function (e) { });
};
export const senderOTP = (phone, otp, ref, callblack) => {
  Otp(
    true,
    JSON.stringify({
      project_key: config.project_key,
      phone: phone,
      ref_code: ref,
    }),
    callblack
  );
};
export const senderValidate = (token, otp_code, ref_code, callblack) => {
  Otp(
    false,
    JSON.stringify({
      token: token,
      otp_code: otp_code,
      ref_code: ref_code,
    }),
    callblack
  );
};
