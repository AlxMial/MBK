import moment from "moment";
import { IsNullOrEmpty } from "./default.service";
const name = "MBK";

export const setLiff = (profile) => {
  sessionStorage.setItem(name + "-Liff", JSON.stringify(profile));
};
export const getLiff = () => {
  let profile = sessionStorage.getItem(name + "-Liff");
  profile = IsNullOrEmpty(profile) ? "" : JSON.parse(profile);
  return profile;
};
export const removeLiff = () => {
  sessionStorage.removeItem(name + "-Liff");
};

export const setphonnnumber = (phon) => {
  sessionStorage.setItem(name + "-Liff-phon", phon);
};
export const getphonnnumber = () => {
  let phon = sessionStorage.getItem(name + "-Liff-phon");
  phon = IsNullOrEmpty(phon) ? "" : phon;
  return phon;
};
export const removephonnnumber = () => {
  sessionStorage.removeItem(name + "-Liff-checkRegister");
};

export const setcheckRegister = (register) => {
  sessionStorage.setItem(
    name + "-Liff-checkRegister",
    JSON.stringify(register)
  );
};
export const getcheckRegister = () => {
  let register = sessionStorage.getItem(name + "-Liff-checkRegister");
  register = IsNullOrEmpty(register) ? "" : JSON.parse(register);
  return register;
};
export const removecheckRegister = () => {
  sessionStorage.removeItem(name + "-Liff-checkRegister");
};

export const setphon = (phon) => {
  sessionStorage.setItem(name + "-phon", phon);
};
export const getphon = () => {
  let phon = sessionStorage.getItem(name + "-phon");
  phon = IsNullOrEmpty(phon) ? "" : phon;
  return phon;
};
export const removephon = () => {
  sessionStorage.removeItem(name + "-phon");
};

export const setaccessToken = (phon) => {
  sessionStorage.setItem("accessToken", phon);
};
export const getaccessToken = () => {
  let phon = sessionStorage.getItem("accessToken");
  phon = IsNullOrEmpty(phon) ? "" : phon;
  return phon;
};
export const removeaccessToken = () => {
  sessionStorage.removeItem("accessToken");
};

export const setImageStorage = (img) => {
  sessionStorage.setItem(
    name + "-ImageStorage" + img.id,
    JSON.stringify({
      data: img.data,
      exp: moment(new Date()).add(30, "m").toDate(),
    })
  );
};
export const getImageStorage = (id) => {
  let img = sessionStorage.getItem(name + "-ImageStorage" + id);
  if (img == null) {
    return null;
  } else {
    img = JSON.parse(img);
    let time = moment(new Date()).toDate();
    let timeExp = moment(new Date(img.exp)).toDate();
    if (timeExp > time) {
      return img.data;
    } else {
      return null;
    }
  }
};
// export const removeImageStorage = () => {
//   sessionStorage.removeItem("accessToken");
// };
