import React, { useState } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import Spinner from "components/Loadings/spinner/Spinner";
// import axios from "services/axios";
import * as Session from "../services/Session.service";
import { useHistory } from "react-router-dom";
import liff from "@line/liff";
import { IsNullOrEmpty } from "@services/default.service";

import {
  path,
  routes,
  checkRegister as apiCheckRegister,
} from "@services/liff.services";

// components
const dev = true;

const getRoutes = () => {
  return routes.map((prop, key) => {
    return (
      <Route id={key} key={key} path={prop.path} component={prop.component} />
    );
  });
};

const initLine = (callback, setView) => {
  if (dev) {
    runApp(callback, setView);
  } else {
    liff.init(
      { liffId: "1657109260-L0jrqxlN" },
      () => {
        if (liff.isLoggedIn()) {
          runApp(callback, setView);
        } else {
          setView();
          liff.login();
        }
      },
      (err) => console.error(err)
    );
  }
};
const runApp = (callback, setView) => {
  if (dev) {
    Session.setLiff({
      uid: "Ubfcc855b6a6dae691da898801d1ec206",
      pictureUrl: null,
    });
    let checkRegister = Session.getcheckRegister();
    if (IsNullOrEmpty(checkRegister)) {
      apiCheckRegister((res) => {
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
        setView();
      });
    } else {
      callback(checkRegister);
      setView();
    }
  } else {
    liff
      .getProfile()
      .then((profile) => {
        const LineID = profile.userId;
        Session.setLiff({
          uid: LineID,
          pictureUrl: profile.pictureUrl,
        });
        let checkRegister = Session.getcheckRegister();
        if (IsNullOrEmpty(checkRegister)) {
          apiCheckRegister((res) => {
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
            setView();
          });
        } else {
          callback(checkRegister);
          setView();
        }
      })
      .catch((err) => console.log(err));
  }
};
// views
const LiffAPP = () => {
  let history = useHistory();
  const [view, setview] = useState(false);
  let pathname = window.location.pathname;
  let bg = "100px";
  let ismemberpage = false;
  if (pathname.includes("register")) {
    Session.removecheckRegister();
  }

  if (
    pathname.toLowerCase().includes("member") ||
    pathname.toLowerCase().includes("point") ||
    pathname.toLowerCase().includes("coupon") ||
    pathname.toLowerCase().includes("/reward")
  ) {
    bg = "180px";

    if (
      pathname.includes("point") ||
      pathname.toLowerCase().includes("/reward")
    ) {
      bg = "280px";
    }
    ismemberpage = true;
  }
  if (!view) {
    initLine(
      (e) => {
        let checkRegister = Session.getcheckRegister();
        if (checkRegister.isRegister !== true) {
          if (!pathname.includes("register")) {
            history.push(path.register);
          }
        } else {
          if (pathname.includes("register")) {
            history.push(path.member);
          }
        }
      },
      () => {
        setview(true);
      }
    );
  }

  return (
    <>
      {!view ? (
        <Spinner customText={"Loading"} />
      ) : (
        <div style={{ display: !view ? "none" : "", minHeight: "100vh" }}>
          <div
            className={"noselect " + (!ismemberpage ? "bg-green-mbk flex" : "")}
            style={{ height: bg }}
          >
            <div className="w-full">
              {ismemberpage ? (
                <img
                  className="w-full"
                  src={
                    pathname.includes("point") ||
                    pathname.toLowerCase().includes("/reward")
                      ? require("assets/img/mbk/Background.jpg").default
                      : require("assets/img/mbk/line_head_img.jpg").default
                  }
                  alt="line_head_img"
                  style={{
                    objectFit: "fill",
                    // height: bg,
                  }}
                ></img>
              ) : (
                <img
                  src="https://www.prg.co.th/images/logo.png"
                  alt="logo_mbk"
                  className=" mt-6 "
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
            <Redirect from="/line/" to="/line/register" />
          </Switch>
        </div>
      )}
    </>
  );
};

export default LiffAPP;
