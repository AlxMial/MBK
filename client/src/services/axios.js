import axios from "axios";
const username = "VUh4MmZDekFzeDlHd1BHVzJranpHUT09";
const password = "NFgrWHk2bTE1UURGZ0M0WXVwOVpxQT09";
const token = Buffer.from(`${username}:${password}`, "utf8").toString("base64");

export default axios.create({
  // baseURL: `http://undefined.ddns.net:8083/`,
  baseURL: `https://undefined.ddns.net/mbkserver/`,
  // baseURL: `http://localhost:3001/mbkserver/`,
  headers: {
    Authorization: `Basic ${token}`,
    "Content-type": "application/json",
    accessToken: localStorage.getItem("accessToken"),
  },
});
export const senderOTP = (phone,otp,ref) => {
  var config = {
    method: "post",
    url: "https://portal-otp.smsmkt.com/api/send-message",
    headers: {
      "Content-Type": "application/json",
      api_key: "915ce264de8250902d3a898a042cf2cc",
      secret_key: "2Zy0peafw7RGLkBn",
    },
    data: JSON.stringify({
      message:
        "Your OTP is " + otp + " (REF:"+ref+")",
      phone: phone,
      sender: "Demo-SMS",
    }),
  };
  axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
      return this.DataResultSucceed("");
    })
    .catch(function (e) {
    });
};
