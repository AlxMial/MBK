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
import reward from "views/liff/reward/reward";

import rewardRedeem from "views/liff/reward/reward.redeem";
import rewardSpin from "views/liff/reward/reward.spin";
import rewardExchange from "views/liff/reward/reward.exchange";

import shopList from "views/liff/shop/shopList";
import cancelPage from "views/liff/shop/cancel";
import returnPage from "views/liff/shop/return";

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
export const checkRegister = (s, e = () => {}, f = () => {}) => {
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

export const getMember = (s, e = () => {}, f = () => {}) => {
  httpGet("/members/getMember", s, e, f);
};

export const getMemberpoints = (s, e = () => {}, f = () => {}) => {
  httpGet("/members/getMemberPoints", s, e, f);
};
export const getMemberPointsList = (s, e = () => {}, f = () => {}) => {
  httpGet("/members/getMemberPointsList", s, e, f);
  // axios
  //   .get("/members/getMemberPointsList")
  //   .then((res) => {
  //     s(res);
  //   })
  //   .catch((error) => {
  //     e(error);
  //   })
  //   .finally((final) => {
  //     f();
  //   });
};

export const membersDpd = (data, s, e = () => {}, f = () => {}) => {
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
export const redeem = (data, s, e = () => {}, f = () => {}) => {
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

export const listPointStore = (s, e = () => {}, f = () => {}) => {
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
