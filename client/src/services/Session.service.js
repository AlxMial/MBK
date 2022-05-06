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
  sessionStorage.setItem(name + "-Liff-checkRegister", register);
};
export const getcheckRegister = () => {
  let register = sessionStorage.getItem(name + "-Liff-checkRegister");
  register = IsNullOrEmpty(register) ? "" : register;
  return register;
};
export const removecheckRegister = () => {
  sessionStorage.removeItem(name + "-Liff-checkRegister");
};

