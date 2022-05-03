import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

// components

import Line from "views/liff/Line";

// views
export default function Liff() {
  return (
    <>
      <Switch>
        <Route path="/auth/login" exact component={Line} />
        <Redirect from="/" to="/auth/login" />
      </Switch>
    </>
  );
}
