import { IsNullOrEmpty } from "./default.service";

const name = "MBK";

export const SetLanguage = (lang) => {
  localStorage.setItem(name + "-Language", lang);
};

export const GetLanguage = () => {
  let lang = localStorage.getItem(name + "-Language");
  lang = IsNullOrEmpty(lang) ? "th" : lang;
  return lang;
};

export const SetRemember = (data) => {
  localStorage.setItem(name + "-Remember", JSON.stringify(data));
};

export const GetRemember = (obj) => {
  let Remember = localStorage.getItem(name + "-Remember");
  if (!IsNullOrEmpty(Remember)) {
    Remember = JSON.parse(Remember);
  } else {
    Remember = "";
  }
  return Remember;
};

export const SetEnum = (data, _name) => {
  localStorage.setItem(name + "-Enum-" + _name, JSON.stringify(data));
};

export const GetEnum = (_name) => {
  let Remember = localStorage.getItem(name + "-Enum-" + _name);
  if (!IsNullOrEmpty(Remember)) {
    Remember = JSON.parse(Remember);
  } else {
    Remember = "";
  }
  return Remember;
};

export const RemoveEnum = (_name) => {
  localStorage.removeItem(name + "-Enum-" + _name);
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

// add_to_cart เก็บใน localStorage ก่อน
// obj : id, quantity
export const set_add_to_cart = (obj) => {
  let cart = get_cart();
  if (IsNullOrEmpty(cart)) {
    let data = { shop_orders: [obj] };
    localStorage.setItem("cart", JSON.stringify(data));
  } else {
    let old_shop_orders = cart.shop_orders;
    let old = old_shop_orders.find((e) => e.id === obj.id);
    // ยังไม่มี
    if (IsNullOrEmpty(old)) {
      old_shop_orders.push(obj);
      let data = { shop_orders: old_shop_orders };
      localStorage.setItem("cart", JSON.stringify(data));
    } else {
      old_shop_orders.filter((e) => {
        if (e.id === obj.id) {
          e.quantity = e.quantity + obj.quantity;
        }
      });
      let data = { shop_orders: old_shop_orders };
      localStorage.setItem("cart", JSON.stringify(data));
    }
  }
};
export const get_cart = () => {
  let cart = localStorage.getItem("cart");
  cart = IsNullOrEmpty(cart) ? "" : JSON.parse(cart);
  return cart;
};
export const upd_cart = (obj) => {
  localStorage.setItem("cart", JSON.stringify(obj));
};
export const remove_cart = () => {
  localStorage.removeItem("cart");
};


export const setbyorder = (obj) => {
  let data = { shop_orders: [obj] };
  localStorage.setItem("byorder", JSON.stringify(data));
};
export const getbyorder = () => {
  let byorder = localStorage.getItem("byorder");
  byorder = IsNullOrEmpty(byorder) ? "" : JSON.parse(byorder);
  return byorder;
};

export const updbyorder = (obj) => {
  localStorage.setItem("byorder", JSON.stringify(obj));
};
export const remove_byorder = () => {
  localStorage.removeItem("byorder");
};
