import moment from "moment";
import * as Storage from "@services/Storage.service";
import Resizer from "react-image-file-resizer";
const crypto = require("crypto");
const ENC_KEY = "bf3c199c2470cb477d907b1e0917c17b";
const IV = "5183666c72eec9e4";

export const IsNullOrEmpty = (obj) => {
  if ("undefined" === typeof obj || obj == null) {
    return true;
  } else if (
    typeof obj != "undefined" &&
    obj != null &&
    obj.length != null &&
    obj.length === 0
  ) {
    return true; //array
  } else if ("number" === typeof obj) {
    return obj !== obj; //NaN
  } else if ("string" === typeof obj) {
    return obj.length < 1 ? true : false;
  } else {
    return false;
  }
};
// DateTime To yyyy-MM-dd
export const ConverDateTimeToString = (date) => {
  let str = "";
  if (!IsNullOrEmpty(date)) {
    const MM =
      date.getMonth() < 10 ? "0" + (date.getMonth() + 1) : date.getMonth();
    const DD = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    str = date.getFullYear() + "-" + MM + "-" + DD;
  }
  return str;
};

export const ConverDateTimeToDatePicker = (date) => {
  let str = "";
  if (!IsNullOrEmpty(date)) {
    const MM =
      date.getMonth() < 10 ? "0" + (date.getMonth() + 1) : date.getMonth();
    const DD = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    str = MM + "-" + DD + "-" + date.getFullYear();
  }
  return str;
};

export const DifferenceDate = (date1, date2) => {
  var result = {
    years: date2.getYear() - date1.getYear(),
    months: date2.getMonth() - date1.getMonth(),
    days: date2.getDate() - date1.getDate(),
    hours: date2.getHours() - date1.getHours(),
  };
  if (result.hours < 0) {
    result.days--;
    result.hours += 24;
  }
  if (result.days < 0) {
    result.months--;
    // days = days left in date1's month,
    //   plus days that have passed in date2's month
    var copy1 = new Date(date1.getTime());
    copy1.setDate(32);
    result.days = 32 - date1.getDate() - copy1.getDate() + date2.getDate();
  }
  if (result.months < 0) {
    result.years--;
    result.months += 12;
  }
  return result;
};

export const liff_dateToString = (date, format) => {
  return IsNullOrEmpty(date)
    ? "-"
    : moment(date).locale("th").add(543, "year").format(format);
};

export const getCartNumberBadge = (date, format) => {
  let cart = Storage.get_cart();
  return IsNullOrEmpty(cart) ? null : cart.shop_orders.length;
};

export const EncodeKey = (id) => {
  if (IsNullOrEmpty(id)) {
    return "";
  }
  id = encrypt(id.toString());
  let buf = new Buffer.from(id, "ascii");
  id = buf.toString("base64");
  return id;
};

const encrypt = (val) => {
  let cipher = crypto.createCipheriv("aes-256-cbc", ENC_KEY, IV);
  let encrypted = cipher.update(val, "utf8", "base64");
  encrypted += cipher.final("base64");
  return encrypted;
};

export const formatMoney = (val) => {
  return parseFloat(val)
    .toFixed(2)
    .replace(/\d(?=(\d{3})+\.)/g, "$&,");
};

export const DecodeKey = (id) => {
  try {
    if (this.IsNullOrEmpty(id)) {
      return "";
    }
    let buff = new Buffer.from(id, "base64");
    // console.log(buff)
    id = buff.toString("ascii");
    return this.decrypt(id);
  } catch {
    return id;
  }
};

export const decrypt = (encrypted) => {
  let decipher = crypto.createDecipheriv("aes-256-cbc", ENC_KEY, IV);
  let decrypted = decipher.update(encrypted, "base64", "utf8");
  return decrypted + decipher.final("utf8");
};

export const isFlashSale = (e) => {
  let isFlash = false;
  if (e.isFlashSale && e.startDateCampaign && e.startDateCampaign) {
    let startDateCampaign = new Date(
      new Date(e.startDateCampaign)
        .toISOString()
        .split("T")[0]
        .replace(/-/g, "/")
    );
    let endDateCampaign = new Date(
      new Date(e.endDateCampaign).toISOString().split("T")[0].replace(/-/g, "/")
    );
    let _today = new Date();
    let today = new Date(
      _today.getFullYear() +
      "/" +
      (_today.getMonth() + 1) +
      "/" +
      _today.getDate()
    );
    if (today >= startDateCampaign && today <= endDateCampaign) {
      let startTimeCampaign = new Date(
        new Date().toISOString().split("T")[0].replace(/-/g, "/") +
        " " +
        e.startTimeCampaign
      );
      let endTimeCampaign = new Date(
        new Date().toISOString().split("T")[0].replace(/-/g, "/") +
        " " +
        e.endTimeCampaign
      );
      today = new Date();
      // อยู่ในเวลา
      if (today > startTimeCampaign && today < endTimeCampaign) {
        isFlash = true;
      }
    }
  }

  return isFlash;
};

export const resizeFile = file =>
  new Promise(resolve => {
    Resizer.imageFileResizer(
      file,
      400,
      400,
      "JPEG",
      100,
      0,
      uri => {
        resolve(uri);
      },
      "base64"
    );
  });
