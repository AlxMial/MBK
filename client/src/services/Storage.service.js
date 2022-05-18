import {IsNullOrEmpty} from "./default.service"

const name = "MBK";

export const SetLanguage = (lang) => {
  localStorage.setItem(name + "-Language",lang)
};

export const GetLanguage = () => {
  let lang = localStorage.getItem(name + "-Language");
  lang = IsNullOrEmpty(lang) ? "th" : lang;
  return lang;
};

export const SetRemember = (data) => {
  localStorage.setItem(name + "-Remember",JSON.stringify(data))
};

export const GetRemember = (obj) => {
  let Remember = localStorage.getItem(name + "-Remember");
  if(!IsNullOrEmpty(Remember)) {
    Remember = JSON.parse(Remember)
  } else {
    Remember ="";
  }
  return Remember
};

export const SetEnum = (data,_name) => {
  localStorage.setItem(name + "-Enum-"+_name,JSON.stringify(data))
};

export const GetEnum = (_name) => {
  let Remember = localStorage.getItem(name + "-Enum-"+_name);
  if(!IsNullOrEmpty(Remember)){
    Remember = JSON.parse(Remember)
  }else{
    Remember ="";
  }
  return Remember
};

export const RemoveEnum = (_name) => {
  localStorage.removeItem(name + "-Enum-"+_name)
};


export const setaccessToken = (phon) => {
  localStorage.setItem("accessToken", phon);
};
export const getaccessToken = () => {
  let phon = localStorage.getItem("accessToken");
  phon = IsNullOrEmpty(phon) ? "" : phon;
  return phon;
};
export const removeaccessToken = () => {
  localStorage.removeItem("accessToken");
};
