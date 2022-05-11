import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import axios from "services/axios";
import * as Session from "../services/Session.service";
import { useHistory } from "react-router-dom";
import liff from "@line/liff";
// components
import privacypolicy from "views/liff/privacypolicy";
import register from "views/liff/register";
import member from "views/liff/member";
import otp from "views/liff/otp";
import getreward from "views/liff/getreward";
import updateprofile from "views/liff/updateprofile";
import point from "views/liff/point";

export const path = {
  privacypolicy: "/line/privacypolicy",
  register: "/line/register",
  member: "/line/member",
  otp: "/line/otp",
  getreward: "/line/getreward",
  updateprofile: "/line/updateprofile",
  point: "/line/point",
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
];

const getRoutes = () => {
  return routes.map((prop, key) => {
    return (
      <Route id={key} key={key} path={prop.path} component={prop.component} />
    );
  });
};

const initLine = (callback) => {
  runApp(callback);

  // liff.init(
  //   { liffId: "1657109260-L0jrqxlN" },
  //   () => {
  //     if (liff.isLoggedIn()) {
  //       runApp(callback);
  //     } else {
  //       liff.login();
  //     }
  //   },
  //   (err) => console.error(err)
  // );
};
const runApp = (callback) => {
  Session.setLiff({
    uid: "U4d81d62e7ae7795c18f3e2c770595108",
    displayName: "test",
    pictureUrl: "test",
    email: "test",
    memberId: "4",
  });
  let checkRegister = Session.getcheckRegister();
  if (checkRegister !== "true") {
    axios
      .post("/members/checkRegister", { uid: Session.getLiff().uid })
      .then((res) => {
        console.log(res);
        if (res.data.code === 200) {
        } else {
        }
        Session.setcheckRegister(res.data.isRegister);
        // res.data.tbMember.id;
        callback(checkRegister);
      });
  } else {
    callback(checkRegister);
  }
  // liff
  //   .getProfile()
  //   .then((profile) => {
  //     const idTokenDecoded = liff.getDecodedIDToken();
  //     const LineID = profile.userId;
  //     const displayName = profile.displayName;
  //     const pictureUrl = profile.pictureUrl;
  //     Session.setLiff({
  //       uid: LineID,
  //       displayName: displayName,
  //       pictureUrl: pictureUrl,
  //       email: idTokenDecoded.email,
  //     });
  //   })
  //   .catch((err) => console.log(err));
};
// views
const Liff = () => {
  let history = useHistory();
  let pathname = window.location.pathname;
  // console.log("pathname : " + pathname);
  let bg = "100px";
  let ismemberpage = false;
  if (pathname.toLowerCase().includes("member") || pathname.toLowerCase().includes("point")) {
    bg = "180px";

    if (pathname.includes("point")) {
      bg = "280px";
    }
    ismemberpage = true;
  }

  initLine((e) => {
    if (e === "true") {
      if (pathname.includes("privacypolicy") || pathname.includes("otp")) {
        history.push(path.member);
      }
    } else {
      if (
        !pathname.includes("privacypolicy") &&
        !pathname.includes("otp") &&
        !pathname.includes("register")
      ) {
        history.push(path.privacypolicy);
      }
    }
  });
  return (
    <>
      <div
        className={!ismemberpage ? "bg-green-mbk flex" : ""}
        style={{ height: bg }}
      >
        <div style={{ width: "100%" }}>
          {ismemberpage ? (
            <img
              src={require("assets/img/mbk/line_head_img.jpg").default}
              alt="line_head_img"
              style={{
                objectFit: "fill",
                height: bg,
                width: "100%",
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
