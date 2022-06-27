import { IsNullOrEmpty } from "./default.service";

const name = "MBK";

export const SetLanguage = (lang) => {
  sessionStorage.setItem(name + "-Language", lang);
};

export const GetLanguage = () => {
  let lang = sessionStorage.getItem(name + "-Language");
  lang = IsNullOrEmpty(lang) ? "th" : lang;
  return lang;
};

export const SetRemember = (data) => {
  sessionStorage.setItem(name + "-Remember", JSON.stringify(data));
};

export const GetRemember = (obj) => {
  let Remember = sessionStorage.getItem(name + "-Remember");
  if (!IsNullOrEmpty(Remember)) {
    Remember = JSON.parse(Remember);
  } else {
    Remember = "";
  }
  return Remember;
};

export const SetEnum = (data, _name) => {
  sessionStorage.setItem(name + "-Enum-" + _name, JSON.stringify(data));
};

export const GetEnum = (_name) => {
  let Remember = sessionStorage.getItem(name + "-Enum-" + _name);
  if (!IsNullOrEmpty(Remember)) {
    Remember = JSON.parse(Remember);
  } else {
    Remember = "";
  }
  return Remember;
};

export const RemoveEnum = (_name) => {
  sessionStorage.removeItem(name + "-Enum-" + _name);
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

// add_to_cart เก็บใน sessionStorage ก่อน
// obj : id, quantity
export const set_add_to_cart = (obj) => {
  let cart = get_cart();
  if (IsNullOrEmpty(cart)) {
    let data = { shop_orders: [obj] };
    sessionStorage.setItem("cart", JSON.stringify(data));
  } else {
    let old_shop_orders = cart.shop_orders;
    let old = old_shop_orders.find((e) => e.id === obj.id);
    // ยังไม่มี
    if (IsNullOrEmpty(old)) {
      old_shop_orders.push(obj);
      let data = { shop_orders: old_shop_orders };
      sessionStorage.setItem("cart", JSON.stringify(data));
    } else {
      old_shop_orders.filter((e) => {
        if (e.id === obj.id) {
          e.quantity = e.quantity + obj.quantity;
        }
        return e
      });
      let data = { shop_orders: old_shop_orders };
      sessionStorage.setItem("cart", JSON.stringify(data));
    }
  }
};

export const addconpon_cart = (obj) => {
  sessionStorage.setItem("conpon_cart", JSON.stringify(obj));
}
export const getconpon_cart = () => {
  let cart = sessionStorage.getItem("conpon_cart");
  cart = IsNullOrEmpty(cart) ? null : JSON.parse(cart);
  return cart;
}
export const removeconpon_cart = () => {
  sessionStorage.removeItem("conpon_cart");
};



export const get_cart = () => {
  let cart = sessionStorage.getItem("cart");
  cart = IsNullOrEmpty(cart) ? "" : JSON.parse(cart);
  return cart;
};
export const upd_cart = (obj) => {
  sessionStorage.setItem("cart", JSON.stringify(obj));
};
export const remove_cart = () => {
  sessionStorage.removeItem("cart");
};


export const setbyorder = (obj) => {
  let data = { shop_orders: [obj] };
  sessionStorage.setItem("byorder", JSON.stringify(data));
};
export const getbyorder = () => {
  let byorder = sessionStorage.getItem("byorder");
  byorder = IsNullOrEmpty(byorder) ? "" : JSON.parse(byorder);
  return byorder;
};

export const updbyorder = (obj) => {
  sessionStorage.setItem("byorder", JSON.stringify(obj));
};
export const remove_byorder = () => {
  sessionStorage.removeItem("byorder");
};

export const setusecoupon = (obj) => {
  // let data = { shop_orders: [obj] };
  localStorage.setItem("usecoupon", JSON.stringify(obj));
};

export const getusecoupon = (id) => {
  let obj = localStorage.getItem("usecoupon");
  obj = IsNullOrEmpty(obj) ? null : JSON.parse(obj);
  return obj;
};

