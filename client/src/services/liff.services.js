import axios from "services/axios";
import React from "react";
import * as Session from "../services/Session.service";

import privacypolicy from "views/liff/privacypolicy";
import register from "views/liff/register";
import member from "views/liff/member/member";
import otp from "views/liff/otp";
import getreward from "views/liff/getreward";
import updateprofile from "views/liff/updateprofile";
import point from "views/liff/point";
import coupon from "views/liff/coupon/coupon";
import infocoupon from "views/liff/coupon/infocoupon";
import usecouponUC from "views/liff/coupon/usecouponUC";

import reward from "views/liff/reward/reward";
import inforeward from "views/liff/reward/inforeward";

import product from "views/liff/product/product";
import infoproduct from "views/liff/product/infoproduct";

import rewardRedeem from "views/liff/reward/reward.redeem";
import rewardSpin from "views/liff/reward/reward.spin";
import rewardExchange from "views/liff/reward/reward.exchange";

import shopList from "views/liff/shop/shopList/shopList";
import returnPage from "views/liff/shop/return";
import cancelPage from "views/liff/shop/cancel";
import showProducts from "views/liff/shop/showProducts";
import showCart from "views/liff/shop/showCart";
import usecoupon from "views/liff/shop/usecoupon";

import makeorder from "views/liff/makeorder/makeorder";
import makeorderbyid from "views/liff/makeorder/makeorderByID";
import orderpaymentdone from "views/liff/makeorder/ordeDone/orderpaymentdone";
import addAddress from "views/liff/makeorder/addAddress";

import paymentsucceed from "views/liff/makeorder/paymentsucceed";
//paymentInfo
import paymentInfo from "views/liff/payment/paymentInfo";

import myorder from "views/liff/myorder/myorder";
import ShopMain from "views/liff/shop/shopMain";

export const path = {
  privacypolicy: "/line/privacypolicy",
  register: "/line/register",
  member: "/line/member",
  otp: "/line/otp",
  getreward: "/line/getreward",
  updateprofile: "/line/updateprofile",
  point: "/line/point",
  coupon: "/line/coupon",

  reward: "/line/reward",
  inforeward: "/line/inforeward/:id",

  rewardredeem: "/line/rewardredeem/:id",
  rewardspin: "/line/rewardspin/:id",
  rewardexchange: "/line/rewardexchange/:id",

  cancelPage: "/line/cancelPage/:id",
  returnPage: "/line/returnPage/:id",
  shopList: "/line/shopList",
  shopListCategory: "/line/shopList",
  showProducts: "/line/showProducts/:id",
  showCart: "/line/showCart",
  usecoupon: "/line/usecoupon/:id",
  shopMain: "/line/shopMain",

  makeorder: "/line/makeorder/:id",
  makeorderbyid: "/line/makeorderbyid/:id",
  addAddress: "/line/addAddress",

  paymentInfo: "/line/paymentInfo/:id",

  myorder: "/line/myorder/:id",
  orderpaymentdone: "/line/orderpaymentdone/:id",

  infocoupon: "/line/infocoupon/:id",
  usecouponUC: "/line/usecouponUC/:id",

  product: "/line/product",
  infoproduct: "/line/infoproduct/:id",
  paymentsucceed: "/line/paymentsucceed/:id",
};
export const routes = [
  {
    path: path.privacypolicy,
    component: privacypolicy,
  },
  {
    path: path.register,
    component: register,
  },
  {
    path: path.member,
    component: member,
  },
  {
    path: path.otp,
    component: otp,
  },
  {
    path: path.getreward,
    component: getreward,
  },

  {
    path: path.updateprofile,
    component: updateprofile,
  },
  {
    path: path.point,
    component: point,
  },
  {
    path: path.coupon,
    component: coupon,
  },
  {
    path: path.infocoupon,
    component: infocoupon,
  },
  {
    path: path.usecouponUC,
    component: usecouponUC,
  },
  {
    path: path.product,
    component: product,
  },
  {
    path: path.infoproduct,
    component: infoproduct,
  },
  {
    path: path.paymentsucceed,
    component: paymentsucceed,
  },

  {
    path: path.reward,
    component: reward,
  },
  {
    path: path.inforeward,
    component: inforeward,
  },

  {
    path: path.rewardredeem,
    component: rewardRedeem,
  },
  {
    path: path.rewardspin,
    component: rewardSpin,
  },
  {
    path: path.rewardexchange,
    component: rewardExchange,
  },

  {
    path: path.shopList,
    component: shopList,
  },
  {
    path: path.shopListCategory,
    component: shopList,
  },
  {
    path: path.shopMain,
    component: ShopMain,
  },
  {
    path: path.cancelPage,
    component: cancelPage,
  },
  {
    path: path.returnPage,
    component: returnPage,
  },
  {
    path: path.showProducts,
    component: showProducts,
  },
  {
    path: path.showCart,
    component: showCart,
  },
  {
    path: path.usecoupon,
    component: usecoupon,
  },
  {
    path: path.makeorder,
    component: makeorder,
  },
  {
    path: path.makeorderbyid,
    component: makeorderbyid,
  },
  {
    path: path.orderpaymentdone,
    component: orderpaymentdone,
  },

  {
    path: path.addAddress,
    component: addAddress,
  },

  {
    path: path.paymentInfo,
    component: paymentInfo,
  },

  {
    path: path.myorder,
    component: myorder,
  },
];

const httpGet = (path, s, e, f) => {
  axios
    .get(path)
    .then((res) => {
      s(res);
    })
    .catch((error) => {
      e(error);
    })
    .finally((final) => {
      f();
    });
};
const httpPost = (path, data, s, e, f) => {
  axios
    .post(path, data)
    .then((res) => {
      s(res);
    })
    .catch((error) => {
      e(error);
    })
    .finally((final) => {
      f();
    });
};

export const checkRegister = (s, e = () => { }, f = () => { }) => {
  let _uid = Session.getLiff().uid;
  axios
    .post("/members/checkRegister", { uid: _uid })
    .then((res) => {
      s(res);
    })
    .catch((error) => {
      e(error);
    })
    .finally((final) => {
      f();
    });
};

export const getMember = (s, e = () => { }, f = () => { }) => {
  httpGet("/members/getMember", s, e, f);
};
export const getMyOrder = (s, e = () => { }, f = () => { }) => {
  httpGet("/members/getMyOrder", s, e, f);
};
export const getMyReward = (s, e = () => { }, f = () => { }) => {
  httpGet("/members/getMyReward", s, e, f);
};
export const getMyCoupon = (s, e = () => { }, f = () => { }) => {
  httpGet("/members/getMyCoupon", s, e, f);
};
export const getCouponByID = (data, s, e = () => { }, f = () => { }) => {
  httpPost("/members/getCouponByID", data, s, e, f);
};
export const useCouponByID = (data, s, e = () => { }, f = () => { }) => {
  httpPost("/members/useCouponByID", data, s, e, f);
};
export const getMyProduct = (s, e = () => { }, f = () => { }) => {
  httpGet("/members/getMyProduct", s, e, f);
};
export const getMyProductById = (data, s, e = () => { }, f = () => { }) => {
  httpPost("/members/getMyProductById", data, s, e, f);
};

export const getRedemptionconditionshd = (s, e = () => { }, f = () => { }) => {
  httpGet("/redeem/getRedemptionconditionshd", s, e, f);
};
export const getRedemptionconditionshdById = (
  data,
  s,
  e = () => { },
  f = () => { }
) => {
  httpPost("/redeem/getRedemptionconditionshdById", data, s, e, f);
};

export const useCoupon = (data, s, e = () => { }, f = () => { }) => {
  httpPost("/redeem/useCoupon", data, s, e, f);
};
export const useProduct = (data, s, e = () => { }, f = () => { }) => {
  httpPost("/redeem/useProduct", data, s, e, f);
};
export const useGame = (data, s, e = () => { }, f = () => { }) => {
  httpPost("/redeem/useGame", data, s, e, f);
};

export const getMemberpoints = (s, e = () => { }, f = () => { }) => {
  httpGet("/members/getMemberPoints", s, e, f);
};
export const getMemberPointsList = (s, e = () => { }, f = () => { }) => {
  httpGet("/members/getMemberPointsList", s, e, f);
};
export const getMemberAddress = (s, e = () => { }, f = () => { }) => {
  httpGet("/members/getMemberAddress", s, e, f);
};
export const addMemberAddress = (data, s, e = () => { }, f = () => { }) => {
  httpPost("/members/addMemberAddress", data, s, e, f);
};
export const gettbPayment = (s, e = () => { }, f = () => { }) => {
  httpGet("/payment/gettbPayment", s, e, f);
};
export const getPaymentsucceed = (data, s, e = () => { }, f = () => { }) => {
  httpPost("/payment/getPaymentsucceed ", data, s, e, f);
};

export const gettbLogistic = (s, e = () => { }, f = () => { }) => {
  httpGet("/logistic/gettbLogistic", s, e, f);
};

export const getPromotionstores = (s, e = () => { }, f = () => { }) => {
  httpGet("/payment/getPromotionstores", s, e, f);
};

export const doSaveOrder = (data, s, e = () => { }, f = () => { }) => {
  httpPost("/order/orderHD/doSaveOrder", data, s, e, f);
};
export const doSaveSlip = (data, s, e = () => { }, f = () => { }) => {
  httpPost("/order/orderHD/doSaveSlip", data, s, e, f);
};

export const doSaveUpdateOrder = (data, s, e = () => { }, f = () => { }) => {
  httpPost("/order/orderHD/doSaveUpdateOrder", data, s, e, f);
};

export const upd_shopcart = (data, s, e = () => { }, f = () => { }) => {
  httpPost("/order/orderHD/upd_shopcart", data, s, e, f);
};
export const get_shopcart = (data, s, e = () => { }, f = () => { }) => {
  httpPost("/order/orderHD/get_shopcart", data, s, e, f);
};

//PaymentStatus ,TransportStatus
export const getOrderHD = (data, s, e = () => { }, f = () => { }) => {
  httpPost("/order/orderHD/getOrderHD", data, s, e, f);
};
export const getOrder = (data, s, e = () => { }, f = () => { }) => {
  httpPost("/order/orderHD/getOrder", data, s, e, f);
};
export const getOrderHDById = (data, s, e = () => { }, f = () => { }) => {
  httpPost("/order/orderHD/getOrderHDById", data, s, e, f);
};

export const cancelOrder = (data, s, e = () => { }, f = () => { }) => {
  httpPost("/cancelOrder/cancelOrder", data, s, e, f);
};
export const returnOrder = (data, s, e = () => { }, f = () => { }) => {
  httpPost("/returnOrder/returnOrder ", data, s, e, f);
};

export const membersDpd = (data, s, e = () => { }, f = () => { }) => {
  axios
    .put("members", data)
    .then((res) => {
      s(res);
    })
    .catch((error) => {
      e(error);
    })
    .finally((final) => {
      f();
    });
};
export const redeem = (data, s, e = () => { }, f = () => { }) => {
  axios
    .post("/redeem", data)
    .then((res) => {
      s(res);
    })
    .catch((error) => {
      e(error);
    })
    .finally((final) => {
      f();
    });
};

export const listPointStore = (s, e = () => { }, f = () => { }) => {
  axios
    .get("pointStore/listPointStore")
    .then((res) => {
      s(res);
    })
    .catch((error) => {
      e(error);
    })
    .finally((final) => {
      f();
    });
};

export const sendEmailSuccess = (data, s, e = () => { }, f = () => { }) => {
  axios
    .post("mails/paymentsuccess", data)
    .then((res) => {
      axios
        .post("mails/paymentwatitingadmin", data)
        .then((resAdmin) => {
          s(resAdmin);
        })
        .catch((errorAdmin) => {
          e(errorAdmin);
        })
        .finally((finalAdmin) => {
          f();
        });
      s(res);
    })
    .catch((error) => {
      e(error);
    })
    .finally((final) => {
      f();
    });
};


export const cancelSuccess = (data, s, e = () => { }, f = () => { }) => {
  axios
    .post("mails/cancelsuccess", data)
    .then((res) => {
      s(res);
    })
    .catch((error) => {
      e(error);
    })
    .finally((final) => {
      f();
    });
};

export const sendEmailWaiting = (data, s, e = () => { }, f = () => { }) => {
  axios
    .post("mails/paymentwatiting", data)
    .then((res) => {
      axios
        .post("mails/paymentwatitingadmin", data)
        .then((resAdmin) => {
          s(resAdmin);
        })
        .catch((errorAdmin) => {
          e(errorAdmin);
        })
        .finally((finalAdmin) => {
          f();
        });

      s(res);
    })
    .catch((error) => {
      e(error);
    })
    .finally((final) => {
      f();
    });
};

export const withUniqueId = (Target) => {
  return class WithUniqueId extends React.Component {
    render() {
      return <Target {...this.props} uid={Session.getLiff().uid} />;
    }
  };
};
