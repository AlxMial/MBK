import React from "react";
import { withRouter } from "react-router-dom";
import jwt_decode from "jwt-decode";

const AuthVerify = (props) => {
  props.history.listen(() => {
    const user = localStorage.getItem("accessToken");
    if (user) {
      let decodedJwt = jwt_decode(user);
      const d = new Date(0);
      d.setUTCSeconds(decodedJwt.exp);
      if (d < Date.now()) {
        props.logOut();
      }
    }
  });
  return <div></div>;
};
export default withRouter(AuthVerify);