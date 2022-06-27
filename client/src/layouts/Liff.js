import React, { useState } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import Spinner from "components/Loadings/spinner/Spinner";
import * as Session from "@services/Session.service";
// import * as Storage from "@services/Storage.service";
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

const initLine = (callback, setView, pathname) => {
  if (dev) {
    runApp(callback, setView, pathname);
  } else {
    liff.init(
      { liffId: "1657238460-3deq6ard" },
      () => {
        if (liff.isLoggedIn()) {
          runApp(callback, setView, pathname);
        } else {
          setView();
          liff.login();
        }
      },
      (err) => console.error(err)
    );
  }
};
const runApp = (callback, setView, pathname) => {
  if (dev) {
    Session.setLiff({
      uid: "U6e9bc5a2de9790dd21597c5012928a4c00000",
      pictureUrl: null,
    });
    let checkRegister = Session.getcheckRegister();
    if (IsNullOrEmpty(checkRegister)) {
      apiCheckRegister((res) => {
        let lifdata = {
          uid: "U6e9bc5a2de9790dd21597c5012928a4c00000",
          pictureUrl: null,
        }
        if (res.data.code === 200) {
          if (res.data.isRegister) {
            Session.setaccessToken(res.data.accessToken);
            Session.setLiff(lifdata);
          }
        } else {
        }
        Session.setcheckRegister({
          isRegister: res.data.isRegister,
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
            let lifdata = {
              uid: profile.userId,
              pictureUrl: profile.pictureUrl,
            };
            if (res.data.code === 200) {
              if (res.data.isRegister) {
                Session.setaccessToken(res.data.accessToken);
                Session.setLiff(lifdata);
              }
            } else {
            }
            Session.setcheckRegister({
              isRegister: res.data.isRegister,
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
  const isInClient = dev ? true : liff.isInClient();

  let pathname = window.location.pathname;
  let bg = "100px";
  let ismemberpage = false;
  if (pathname.includes("register")) {
    Session.removecheckRegister();
  }

  if (
    pathname.toLowerCase().includes("member") ||
    pathname.toLowerCase().includes("point") ||
    pathname.toLowerCase().includes("/line/coupon") ||
    pathname.toLowerCase().includes("/line/product") ||
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
  } else if (pathname.toLowerCase().includes("shoplist")) {
    bg = "0px";
  }

  if (!view) {
    initLine(
      (e) => {
        let checkRegister = Session.getcheckRegister();
        if (checkRegister.isRegister !== true) {
          if (pathname.includes("shoplist") || pathname.includes("showProducts") || pathname.includes("showCart")) {

          } else {
            if (!pathname.includes("register")) {
              history.push(path.register);
            }
          }
        } else {
          if (pathname.includes("register")) {
            history.push(path.member);
          }
        }
      },
      () => {
        setview(true);
      },
      pathname
    );
  }

  return (
    <>
      {!isInClient ? (
        <div style={{ height: "100vh" }}>
          <div
            className={"noselect bg-green-mbk flex"}
            style={{ height: "100px" }}
          >
            <div className="w-full">
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
            </div>
          </div>
          <div
            className="mt-2 text-xl"
            style={{ width: "90%", marginLeft: "auto", marginRight: "auto" }}
          >
            {"สามารถเข้าร่วมกิจกรรมได้ผ่าน Line Application บนมือถือเท่านั่น"}
          </div>
        </div>
      ) : !view ? (
        <Spinner customText={"Loading"} />
      ) : (
        <div className="noselect" style={{ display: !view ? "none" : "", height: "100vh" }}>
          <div
            className={"noselect " + (!ismemberpage ? "bg-green-mbk flex" : "")}
            style={{ height: bg }}
          >
            <div className="w-full">
              {pathname
                .toLowerCase()
                .includes("shoplist") ? null : ismemberpage ? (
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
                      maxHeight: "220px"
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
