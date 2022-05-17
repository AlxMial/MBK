import { SET_CURRENT_SHOPSETTING } from "redux/actionTypes";

export const setCurrentShopSetting = shopSetting => {
  return dispatch => {
    dispatch({
      type: SET_CURRENT_SHOPSETTING,
      payload: shopSetting
    });
  };
};