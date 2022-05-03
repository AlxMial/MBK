import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

// components

import Line from "views/liff/Line";

// views
export default function Liff() {
  return (
    <>
      <Switch>
        <Route path="/line/liff" exact component={Line} />
        <Redirect from="/" to="/line/liff" />
      </Switch>
    </>
  );
}
