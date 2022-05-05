import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

// components
import privacypolicy from "views/liff/privacypolicy";
import register from "views/liff/register";
import member from "views/liff/member";
import otp from "views/liff/otp";
import getreward from "views/liff/getreward";

// views
const Liff = () => {
  let pathname = window.location.pathname;
  console.log("pathname : " + pathname);
  let bg = "100px";
  let ismemberpage = false;
  if (pathname.includes("member")) {
    bg = "180px";
    ismemberpage = true;
  }
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
              // className=" w-48 mt-6 "
              style={{
                objectFit: "fill",
                height: "200px",
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
        <Route path="/line/privacypolicy" exact component={privacypolicy} />
        <Route path="/line/register" exact component={register} />
        <Route path="/line/member" exact component={member} />
        <Route path="/line/otp" exact component={otp} />
        <Route path="/line/getreward" exact component={getreward} />
        <Redirect from="/" to="/line/privacypolicy" />
      </Switch>
    </>
  );
};

export default Liff;
