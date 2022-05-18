import { SET_CURRENT_SHOPSETTING } from "redux/actionTypes";

const INIT_STATE = {
  currentShopSetting: null,
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case SET_CURRENT_SHOPSETTING: {
      return {
        ...state,
        currentShopSetting: action.payload,
      };
    }

    default:
      return state;
  }
};
