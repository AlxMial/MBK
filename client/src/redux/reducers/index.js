import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";

import shopSetting from "./shopSetting";
import common from "./common";

export default history =>
  combineReducers({
    router: connectRouter(history),
    common: common,
    shopSetting: shopSetting
  });
