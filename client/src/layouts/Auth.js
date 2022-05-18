import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { useDispatch } from "react-redux";
// components
import Navbar from "components/Navbars/AuthNavbar.js";
import FooterSmall from "components/Footers/FooterSmall.js";
import AuthVerify from "redux/common/AuthVerify";
import { logout } from "redux/actions/auth";
// views
import Login from "views/auth/Login.js";
import Register from "views/auth/Register.js";
import ForgotPassword from "views/auth/ForgotPassword";
import ResetPassword from "views/auth/ResetPassword";
import ForgotReturn from "views/auth/ForgotReturn";

export default function Auth() {
  const dispatch = useDispatch();

  const logOut = () => {
    dispatch(logout());
  };

  return (
    <>
      <Navbar transparent />
      <main>
        <section className="relative w-full h-full pt-32 min-h-screen">
          <Switch>
          <Route path="/auth/login" exact component={Login} />
            <Route path="/auth/register" exact component={Register} />
            <Route path="/auth/forgotpassword" exact component={ForgotPassword} />
            <Route path="/auth/resetpassword/:id" exact component={ResetPassword} />
            <Route path="/auth/forgotreturn" exact component={ForgotReturn} />
            <Redirect from="/" to="/auth/login" />
          </Switch>
          {/* <FooterSmall absolute /> */}
          <AuthVerify logOut={logOut}/>
        </section>
      </main>
    </>
  );
}
