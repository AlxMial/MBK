import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";

import shopSetting from "./shopSetting";

export default history =>
  combineReducers({
    router: connectRouter(history),
    shopSetting: shopSetting
  });
