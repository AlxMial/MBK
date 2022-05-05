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
