import axios from "services/axios";
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
];

export const checkRegister = (s, e = () => {}, f = () => {}) => {
  axios
    .post("/members/checkRegister", { uid: Session.getLiff().uid })
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
