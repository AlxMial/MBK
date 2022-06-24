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
import reward from "views/liff/reward/reward";

import rewardRedeem from "views/liff/reward/reward.redeem";
import rewardSpin from "views/liff/reward/reward.spin";
import rewardExchange from "views/liff/reward/reward.exchange";

import shopList from "views/liff/shop/shopList";
import returnPage from "views/liff/shop/return";
import cancelPage from "views/liff/shop/cancel";
import showProducts from "views/liff/shop/showProducts";
import showCart from "views/liff/shop/showCart";
import usecoupon from "views/liff/shop/usecoupon";


import makeorder from "views/liff/makeorder/makeorder";
import makeorderbyid from "views/liff/makeorder/makeorderByID";
import orderpaymentdone from "views/liff/makeorder/orderpaymentdone";
import addAddress from "views/liff/makeorder/addAddress";

//paymentInfo 
import paymentInfo from "views/liff/payment/paymentInfo";

import myorder from "views/liff/myorder/myorder";

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

  rewardredeem: "/line/rewardredeem/:id",
  rewardspin: "/line/rewardspin/:id",
  rewardexchange: "/line/rewardexchange/:id",

  cancelPage: "/line/cancelPage/:id",
  returnPage: "/line/returnPage/:id",
  shopList: "/line/shopList",
  showProducts: "/line/showProducts/:id",
  showCart: "/line/showCart",
  usecoupon: "/line/usecoupon/:id",

  makeorder: "/line/makeorder/:id",
  makeorderbyid: "/line/makeorderbyid/:id",
  addAddress: "/line/addAddress",

  paymentInfo: "/line/paymentInfo/:id",

  myorder: "/line/myorder/:id",
  orderpaymentdone: "/line/orderpaymentdone/:id",

  infocoupon: "/line/infocoupon/:id",

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
    path: path.reward,
    component: reward,
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
export const gettbLogistic = (s, e = () => { }, f = () => { }) => {
  httpGet("/logistic/gettbLogistic", s, e, f);
};

export const doSaveOrder = (data, s, e = () => { }, f = () => { }) => {
  httpPost("/order/orderHD/doSaveOrder", data, s, e, f);
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

export const withUniqueId = (Target) => {
  return class WithUniqueId extends React.Component {
    render() {
      return <Target {...this.props} uid={Session.getLiff().uid} />;
    }
  };
};
