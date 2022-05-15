import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import axios from "services/axios";
import * as Session from "../services/Session.service";
import { useHistory } from "react-router-dom";
import liff from "@line/liff";
import { IsNullOrEmpty } from "@services/default.service";
// components
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
const dev = false;
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
const routes = [
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

const getRoutes = () => {
  return routes.map((prop, key) => {
    return (
      <Route id={key} key={key} path={prop.path} component={prop.component} />
    );
  });
};

const initLine = (callback) => {
  if (dev) {
    runApp(callback);
  } else {
    liff.init(
      { liffId: "1657109260-L0jrqxlN" },
      () => {
        if (liff.isLoggedIn()) {
          runApp(callback);
        } else {
          liff.login();
        }
      },
      (err) => console.error(err)
    );
  }
};
const runApp = (callback) => {
  if (dev) {
    Session.setLiff({
      uid: "U111111111111111111111111111",
    });
    let checkRegister = Session.getcheckRegister();
    if (IsNullOrEmpty(checkRegister)) {
      axios
        .post("/members/checkRegister", { uid: Session.getLiff().uid })
        .then((res) => {
          let lifdata = Session.getLiff();
          if (res.data.code === 200) {
            if (res.data.isRegister) {
              lifdata.memberId = res.data.tbMember.id;
              Session.setLiff(lifdata);
            }
          } else {
          }
          Session.setcheckRegister({
            isRegister: res.data.isRegister,
            isConsent: res.data.isConsent,
          });
          callback(checkRegister);
        });
    } else {
      callback(checkRegister);
    }
  } else {
    liff
      .getProfile()
      .then((profile) => {
        const idTokenDecoded = liff.getDecodedIDToken();
        const LineID = profile.userId;
        Session.setLiff({
          uid: LineID,
        });
        let checkRegister = Session.getcheckRegister();
        if (IsNullOrEmpty(checkRegister)) {
          axios
            .post("/members/checkRegister", { uid: Session.getLiff().uid })
            .then((res) => {
              // console.log(res);
              let lifdata = Session.getLiff();

              if (res.data.code === 200) {
                if (res.data.isRegister) {
                  lifdata.memberId = res.data.tbMember.id;
                  Session.setLiff(lifdata);
                }
              } else {
              }
              Session.setcheckRegister({
                isRegister: res.data.isRegister,
                isConsent: res.data.isConsent,
              });
              callback(checkRegister);
            });
        } else {
          callback(checkRegister);
        }
      })
      .catch((err) => console.log(err));
  }
};
// views
const Liff = () => {
  let history = useHistory();
  let pathname = window.location.pathname;
  let bg = "100px";
  let ismemberpage = false;
  if (
    pathname.toLowerCase().includes("member") ||
    pathname.toLowerCase().includes("point") ||
    pathname.toLowerCase().includes("coupon") ||
    pathname.toLowerCase() === "reward"
  ) {
    bg = "180px";

    if (
      pathname.includes("point") ||
      pathname.toLowerCase().includes("reward")
    ) {
      bg = "280px";
    }
    ismemberpage = true;
  }

  initLine((e) => {
    let checkRegister = Session.getcheckRegister();
    if (checkRegister.isRegister === true) {
      if (
        // pathname.includes("privacypolicy") ||
        // pathname.includes("otp") ||
        pathname.includes("register")
      ) {
        history.push(path.member);
      }
    } else {
      if (
        // !pathname.includes("privacypolicy") &&
        // !pathname.includes("otp") &&
        !pathname.includes("register")
      ) {
        history.push(path.register);
      }
    }
  });
  return (
    <>
      <div
        className={"noselect " + (!ismemberpage ? "bg-green-mbk flex" : "")}
        style={{ height: bg }}
      >
        <div className="w-full">
          {ismemberpage ? (
            <img
              className="w-full"
              src={require("assets/img/mbk/line_head_img.jpg").default}
              alt="line_head_img"
              style={{
                objectFit: "fill",
                height: bg,
              }}
            ></img>
          ) : (
            <img
              src={require("assets/img/mbk/logo_mbk.png").default}
              alt="logo_mbk"
              className=" w-48 mt-6 "
              style={{
                display: "block",
                marginLeft: "auto",
                marginRight: "auto",
              }}
            ></img>
          )}
        </div>
      </div>
      <Switch>
        {getRoutes()}
        <Redirect from="/" to="/line/privacypolicy" />
      </Switch>
    </>
  );
};

export default Liff;
