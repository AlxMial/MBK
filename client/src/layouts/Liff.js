import React, { useState, useEffect } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import Spinner from "components/Loadings/spinner/Spinner";
import * as Session from "@services/Session.service";
import { useHistory } from "react-router-dom";
import liff from "@line/liff";
import { IsNullOrEmpty } from "@services/default.service";
import { useSelector } from "react-redux";

import {
  path,
  routes,
  checkRegister as apiCheckRegister,
} from "@services/liff.services";
import config from "@services/helpers";
import Menu from "views/liff/menu";

// components
const getRoutes = () => {
  return routes.map((prop, key) => {
    return (
      <Route id={key} key={key} path={prop.path} component={prop.component} />
    );
  });
};

const initLine = (callback, setView, pathname) => {
  if (config.dev) {
    runApp(callback, setView, pathname);
  } else {
    liff.init(
      { liffId: config.liffId },
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
  if (config.dev) {
    Session.setLiff({
      uid: config.UID,
      pictureUrl: null,
    });
    let checkRegister = Session.getcheckRegister();
    if (IsNullOrEmpty(checkRegister)) {
      apiCheckRegister((res) => {
        let lifdata = {
          uid: config.UID,
          pictureUrl: null,
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
  const isInClient = config.dev ? true : liff.isInClient();

  const { backpage } = useSelector(({ common }) => common);

  let pathname = window.location.pathname;
  const isShopMain = pathname.toLowerCase().includes('shopmain');
  let bg = "90px";
  let ismemberpage = false;
  if (pathname.includes("register")) {
    Session.removecheckRegister();
    Session.removeaccessToken();
  }

  if (
    pathname.toLowerCase().includes("member") ||
    pathname.toLowerCase().includes("point") ||
    pathname.toLowerCase().includes("/reward")
  ) {
    bg = "243px";
    ismemberpage = true;
  }
  // else if (pathname.toLowerCase().includes("shoplist")) {
  //   bg = "0px";
  // }

  if (!view) {
    initLine(
      (e) => {
        let checkRegister = Session.getcheckRegister();
        if (checkRegister.isRegister !== true) {
          if (
            pathname.toLowerCase().includes("shoplist") ||
            pathname.toLowerCase().includes("showProducts") ||
            pathname.toLowerCase().includes("showCart")
          ) {
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

  useEffect(() => {
    window.addEventListener("popstate", function (event) {
      if (window.location.pathname.includes("line/register")) {
        liff.closeWindow();
      } else {
        return event;
      }
    });
  });

  return (
    <>
      {backpage ? (
        <div
          className="absolute"
          style={{
            top: "10px",
            left: "10px",
            color: "#fff",
            zIndex: "1",
          }}
          onClick={() => {
            const _pushMyOrder = localStorage.getItem("pushMyOrder");
            if (pathname.includes("myorder") && _pushMyOrder) {
              localStorage.removeItem("pushMyOrder");
              history.push(_pushMyOrder);
            } else {
              history.goBack();
            }
          }}
        >
          <i className="fas fa-arrow-left" style={{ fontSize: "25px" }}></i>
        </div>
      ) : null}
      {!isInClient ? (
        <div style={{ height: "100vh" }}>
          <div
            className={"noselect bg-green-mbk flex " + pathname.toLowerCase().includes('shopmain') ? 'relative' : ''}
            style={{ height: "90px" }}
          >
            <div className="flex items-center" style={{
              justifyContent: "center", position: "absolute",
              height: bg,
              width: "100%",
              top: "0"
            }}>
              <img
                src={require("assets/img/mbk/Logo.png").default}
                alt="logo_mbk"
                // className=" mt-6 "
                style={{
                  objectFit: "fill",
                  maxWidth: "150px",
                  height: "auto",
                  // top: "1.75rem",
                }}
              ></img>
            </div>
          </div>
          <div
            className="mt-2 text-xl"
            style={{
              width: "90%",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            {"สามารถเข้าร่วมกิจกรรมได้ผ่าน Line Application บนมือถือเท่านั่น"}
          </div>
        </div>
      ) : !view ? (
        <Spinner customText={"Loading"} />
      ) : (
        <div
          className={"noselect " + (isShopMain ? 'line-scroll relative' : '')}
          style={{ display: !view ? "none" : "", height: "100vh" }}
        >
          <div
            className={
              "noselect " +
              ((!ismemberpage ||
                pathname.includes("/line/coupon") ||
                pathname.includes("/line/product")) &&
                !isShopMain
                ? "bg-green-mbk flex"
                : "")
            }
            style={{ height: bg }}
          >
            {isShopMain &&
              <img
                className="w-full h-full absolute flex"
                src={require("assets/img/shop-main/bg-shop-main-w.jpg").default}
                alt="line_head_img"
                style={{
                  objectFit: "fill",
                  height: "auto",
                }}
              ></img>
            }
            <div
              className={"w-full h-full flex " + (pathname.toLowerCase().includes('shopmain') ? 'relative' : '')}
              style={{ justifyContent: "center", alignItems: "center" }}
            >
              {
                // pathname
                //   .toLowerCase()
                //   .includes("shoplist") ? null : 
                ismemberpage &&
                  !pathname.includes("/line/coupon") &&
                  !pathname.includes("/line/product") ? (
                  <div className="w-full " style={{ position: "relative" }}>
                    <img
                      className="w-full h-full"
                      src={require("assets/img/mbk/Header.jpg").default}
                      alt="line_head_img"
                      style={{
                        objectFit: "cover",
                        height: "243px",
                      }}
                    ></img>
                    <div className="flex items-center" style={{
                      justifyContent: "center", position: "absolute",
                      height: "90px",
                      width: "100%",
                      top: "0"
                    }}>
                      <img
                        className="w-full h-full absolute flex"
                        src={require("assets/img/mbk/Logo.png").default}
                        alt="line_head_img"
                        style={{
                          objectFit: "fill",
                          maxWidth: "150px",
                          height: "auto",
                          // top: "1.75rem",
                        }}
                      ></img>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center" style={{
                    justifyContent: "center", position: "absolute",
                    height: "90px",
                    width: "100%",
                    top: "0"
                  }}>
                    <img
                      src={require("assets/img/mbk/Logo.png").default}
                      alt="logo_mbk"
                      // className=" mt-6 "
                      style={{
                        objectFit: "fill",
                        maxWidth: "150px",
                        height: "auto",
                        // top: "1.75rem",
                      }}
                    ></img>
                  </div>
                )}
            </div>
          </div>
          <Switch>
            {getRoutes()}
            <Redirect from="/line/" to="/line/register" />
          </Switch>
          {(pathname.toLowerCase().includes("point") ||
            pathname.toLowerCase().includes("shopmain") ||
            pathname.toLowerCase().includes("myorder") ||
            pathname.toLowerCase().includes("/reward")) &&
            <Menu currentMenu={pathname} />
          }
        </div>
      )
      }
    </>
  );
};

export default LiffAPP;
