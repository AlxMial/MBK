import axios from "axios";
const username = "VUh4MmZDekFzeDlHd1BHVzJranpHUT09";
const password = "NFgrWHk2bTE1UURGZ0M0WXVwOVpxQT09";
const token = Buffer.from(`${username}:${password}`, "utf8").toString("base64");

const axiosInstance = axios.create({
  // baseURL: `https://undefined.ddns.net/mbkserver/`,
  // baseURL: `https://undefined.ddns.net/mahboonkrongserver/`,
  baseURL: `http://localhost:3001/mahboonkrongserver/`,
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
const api_key = "915ce264de8250902d3a898a042cf2cc";
const secret_key = "2Zy0peafw7RGLkBn";
const project_key = "9919fe9150";
const headconfig = {
  "Content-Type": "application/json",
  api_key: api_key,
  secret_key: secret_key,
};
const Otp = (isSender, data, callblack) => {
  var config = {
    method: "post",
    url: isSender
      ? "https://portal-otp.smsmkt.com/api/otp-send"
      : "https://portal-otp.smsmkt.com/api/otp-validate",
    headers: headconfig,
    data: data,
  };

  axios(config)
    .then(function (res) {
      // console.log(JSON.stringify(res.data));
      callblack(res.data);
    })
    .catch(function (e) { });
};
export const senderOTP = (phone, otp, ref, callblack) => {
  Otp(
    true,
    JSON.stringify({
      project_key: project_key,
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
